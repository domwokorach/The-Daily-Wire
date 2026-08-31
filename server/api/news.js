import { Router } from 'express';
import {
  UK_COUNTRY_CODE,
  UK_LANGUAGE,
  UK_NEWS_DOMAINS,
  UK_SOURCE_IDS,
  UK_CATEGORY_FALLBACK_QUERY,
} from '../config/newsSources.js';

const NEWS_API_BASE = 'https://newsapi.org/v2';

const ALLOWED_CATEGORIES = new Set([
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
]);

const ALLOWED_SORT_BY = new Set(['relevancy', 'popularity', 'publishedAt']);

function stripControlChars(raw) {
  let cleaned = '';
  for (const char of raw) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x20 && code !== 0x7f) cleaned += char;
  }
  return cleaned;
}

function sanitizeText(raw, maxLength) {
  if (typeof raw !== 'string') return undefined;
  const cleaned = stripControlChars(raw).trim().slice(0, maxLength);
  return cleaned.length > 0 ? cleaned : undefined;
}

function sanitizeEnum(raw, allowed) {
  if (typeof raw !== 'string') return undefined;
  const lower = raw.trim().toLowerCase();
  return allowed.has(lower) ? lower : undefined;
}

/** Intersects a client-supplied `sources` list with the approved UK allowlist. */
function sanitizeUkSources(raw) {
  if (typeof raw !== 'string') return undefined;
  const ids = raw
    .split(',')
    .map((id) => id.trim().toLowerCase())
    .filter((id) => UK_SOURCE_IDS.includes(id));
  return ids.length > 0 ? ids.join(',') : undefined;
}

function sanitizeInt(raw, { min, max, fallback }) {
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

async function callNewsApi(endpoint, params, apiKey) {
  const upstreamUrl = `${NEWS_API_BASE}/${endpoint}?${params.toString()}`;
  const upstreamResponse = await fetch(upstreamUrl, {
    headers: { 'X-Api-Key': apiKey },
    signal: AbortSignal.timeout(10000),
  });
  const body = await upstreamResponse.json().catch(() => null);
  return { ok: upstreamResponse.ok, status: upstreamResponse.status, body };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * News API occasionally returns `totalResults > 0` alongside an empty
 * `articles` array for the exact same request (observed on `/everything`
 * with broader OR queries) — an upstream inconsistency, not a real "no
 * results" state. One short retry clears it in practice.
 */
async function callNewsApiWithRetry(endpoint, params, apiKey) {
  const first = await callNewsApi(endpoint, params, apiKey);
  const looksAnomalous =
    first.ok &&
    (first.body?.totalResults ?? 0) > 0 &&
    Array.isArray(first.body?.articles) &&
    first.body.articles.length === 0;

  if (!looksAnomalous) return first;

  await sleep(400);
  const retry = await callNewsApi(endpoint, params, apiKey);
  return retry.ok && Array.isArray(retry.body?.articles) && retry.body.articles.length > 0 ? retry : first;
}

/**
 * `top-headlines?country=gb` intermittently comes back with zero articles
 * for an otherwise-valid category (an upstream availability gap, not a
 * request error). Building UK-only content on that alone is unreliable, so
 * an empty result falls back to `/everything` restricted to approved UK
 * domains, using a category-flavoured search term where we have one.
 */
async function fetchUkFallback({ category, q, page, pageSize, apiKey }) {
  const params = new URLSearchParams();
  const categoryQuery = category && UK_CATEGORY_FALLBACK_QUERY[category];
  // Category keywords are title-scoped to stay on-topic (a body/description
  // match on `q` alone is noisy — e.g. "interest rates" turning up inside
  // an unrelated US politics story). A caller-supplied `q` (already a
  // deliberate search term) still searches the full article text.
  if (categoryQuery) {
    params.set('qInTitle', categoryQuery);
  } else if (q) {
    params.set('q', q);
  }
  params.set('domains', UK_NEWS_DOMAINS.join(','));
  params.set('language', UK_LANGUAGE);
  params.set('sortBy', 'publishedAt');
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  return callNewsApiWithRetry('everything', params, apiKey);
}

const router = Router();

router.get('/', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error('[news] NEWS_API_KEY is not configured on the server.');
    res.status(500).json({ error: 'News service is not configured.' });
    return;
  }

  const q = sanitizeText(req.query.q, 200);
  const qInTitle = sanitizeText(req.query.qInTitle, 200);
  const category = sanitizeEnum(req.query.category, ALLOWED_CATEGORIES);
  const sortBy = sanitizeEnum(req.query.sortBy, ALLOWED_SORT_BY);
  const sources = sanitizeUkSources(req.query.sources);
  const page = sanitizeInt(req.query.page, { min: 1, max: 100, fallback: 1 });
  const pageSize = sanitizeInt(req.query.pageSize, { min: 1, max: 100, fallback: 20 });

  // This platform is UK-only. `country`, `domains`, and `language` are never
  // read from the client — the server enforces `gb` (never `uk`) content
  // policy regardless of what a request asks for.
  const params = new URLSearchParams();
  let endpoint;
  let usesCountryHeadlines = false;

  if (sources) {
    // top-headlines rejects `sources` combined with `country`/`category`.
    endpoint = 'top-headlines';
    params.set('sources', sources);
    if (q) params.set('q', q);
  } else if ((q || qInTitle) && !category) {
    // `/v2/everything` has no `country` param, so UK relevance is enforced
    // with an approved UK publisher domain allowlist instead.
    endpoint = 'everything';
    if (q) params.set('q', q);
    if (qInTitle) params.set('qInTitle', qInTitle);
    params.set('domains', UK_NEWS_DOMAINS.join(','));
    params.set('language', UK_LANGUAGE);
    params.set('sortBy', sortBy ?? 'publishedAt');
  } else {
    endpoint = 'top-headlines';
    usesCountryHeadlines = true;
    params.set('country', UK_COUNTRY_CODE);
    params.set('category', category ?? 'general');
    if (q) params.set('q', q);
  }

  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  try {
    let result = await callNewsApiWithRetry(endpoint, params, apiKey);

    if (!result.ok) {
      console.error('[news] upstream error', result.status, result.body?.code, result.body?.message);

      if (result.status === 429) {
        res.status(429).json({ error: 'Too many requests right now. Please try again shortly.' });
        return;
      }

      res.status(502).json({ error: 'Unable to load the latest stories right now. Please try again shortly.' });
      return;
    }

    const hasArticles = Array.isArray(result.body?.articles) && result.body.articles.length > 0;

    if (usesCountryHeadlines && !hasArticles) {
      const fallback = await fetchUkFallback({ category: category ?? 'general', q, page, pageSize, apiKey });
      if (fallback.ok && Array.isArray(fallback.body?.articles) && fallback.body.articles.length > 0) {
        result = fallback;
      }
    }

    res.status(200).json({
      status: result.body?.status ?? 'ok',
      totalResults: typeof result.body?.totalResults === 'number' ? result.body.totalResults : 0,
      articles: Array.isArray(result.body?.articles) ? result.body.articles : [],
    });
  } catch (error) {
    console.error('[news] failed to reach News API', error);
    res.status(502).json({ error: 'Unable to load the latest stories right now. Please try again shortly.' });
  }
});

export default router;
