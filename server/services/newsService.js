import { getUKHeadlines } from '../providers/newsapi/topHeadlines.js';
import { getEverything as fetchEverything } from '../providers/newsapi/everything.js';
import { getSources as fetchSources } from '../providers/newsapi/sources.js';
import { normalizeArticles } from '../providers/newsapi/normalizeArticle.js';
import { normalizeSources } from '../providers/newsapi/normalizeSource.js';
import { mapProviderErrorCode, getSafeNewsErrorMessage, getSafeNewsErrorStatus } from '../providers/newsapi/errors.js';
import { deduplicateArticles } from './newsDeduplication.js';
import { cacheGet, cacheSet } from '../cache/cacheClient.js';
import { newsHeadlinesKey, newsEverythingKey, newsSourcesKey } from '../cache/cacheKeys.js';
import { CACHE_TTL } from '../cache/ttl.js';
import { getEnv } from '../config/env.js';
import {
  APP_SECTION_TO_PROVIDER_CATEGORY,
  PROVIDER_CATEGORY_TO_APP_SECTION,
  NEWS_SECTION_QUERIES,
} from '../config/news.js';
import { UK_NEWS_DOMAINS } from '../config/ukNewsSources.js';

// Sections with a real NewsAPI top-headlines category — everything else
// (politics/world, and bare search) goes through `/v2/everything` instead.
const HEADLINE_SECTIONS = new Set(['business', 'health', 'tech', 'sport']);

// The UK publisher domain allowlist is applied to the curated politics/world
// editorial sections and to the `/v2/everything` UK-relevance fallback
// (below), but never to a user's own free-text search — restricting
// arbitrary search results to five domains would defeat the point of
// Search.
const UK_DOMAINS_PARAM = UK_NEWS_DOMAINS.join(',');

// Prevents N concurrent identical requests from becoming N separate
// upstream NewsAPI calls — every cache-miss for the same key shares one
// in-flight promise.
const inFlightRequests = new Map();

// Last-known-good response per cache key, kept around after its TTL cache
// entry expires so a 429 can still serve *something* instead of an error.
const staleResponseCache = new Map();

function dedupeInFlight(key, run) {
  const existing = inFlightRequests.get(key);
  if (existing) return existing;
  const promise = run().finally(() => inFlightRequests.delete(key));
  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * normalize → dedupe → sort by recency. No classification stage — the
 * `section` every article carries comes from the request context (the
 * category/section that was actually queried), since NewsAPI has no
 * per-article category of its own.
 */
function runPipeline(rawArticles, section) {
  const normalized = normalizeArticles(rawArticles, section);
  const deduped = deduplicateArticles(normalized);
  return [...deduped].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

function toEnvelope(articles, totalResults, page, pageSize) {
  const total = totalResults ?? articles.length;
  return {
    status: 'ok',
    totalResults: total,
    articles,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}

function errorResponse(logLabel, err) {
  const internalCode = mapProviderErrorCode(err);
  console.error(logLabel, err?.status, err?.code, err?.message);

  return {
    status: getSafeNewsErrorStatus(internalCode),
    body: {
      error: true,
      code: internalCode,
      message: getSafeNewsErrorMessage(internalCode),
      ...(getEnv().isProduction ? {} : { provider: 'newsapi.org', upstreamStatus: err?.status }),
    },
  };
}

/**
 * Shared cache + single-flight dedup + stale-on-rate-limit wrapper for
 * every `/api/news/*` read. On a 429 from NewsAPI, falls back to the last
 * successful response for this key rather than surfacing an error.
 */
async function withCache(cacheKey, ttlMs, logLabel, fetchAndNormalize) {
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  return dedupeInFlight(cacheKey, async () => {
    const cachedAgain = cacheGet(cacheKey);
    if (cachedAgain) return { status: 200, body: cachedAgain };

    try {
      const payload = await fetchAndNormalize();
      cacheSet(cacheKey, payload, ttlMs);
      staleResponseCache.set(cacheKey, payload);
      return { status: 200, body: payload };
    } catch (err) {
      const internalCode = mapProviderErrorCode(err);
      if (internalCode === 'NEWS_RATE_LIMITED') {
        const stale = staleResponseCache.get(cacheKey);
        if (stale) return { status: 200, body: stale };
      }
      return errorResponse(logLabel, err);
    }
  });
}

function buildSectionQuery(section, q) {
  const sectionQuery = NEWS_SECTION_QUERIES[section];
  if (!sectionQuery) return q;
  return q ? `(${sectionQuery}) AND (${q})` : sectionQuery;
}

/**
 * `/v2/top-headlines?country=gb` falls back to this UK-domain-scoped
 * `/v2/everything` query whenever the headlines request comes back with no
 * usable articles. Verified live: some NewsAPI.org plans/keys return
 * `{ status: 'ok', totalResults: N, articles: [] }` for `/v2/top-headlines`
 * once `country` is set — not an error, just an empty result the caller has
 * to notice — while the same request without `country` (or `/v2/everything`
 * with a domain allowlist) returns real articles. This keeps every section
 * working across both the intended `country=gb` behaviour and that
 * restriction.
 */
async function fetchUkFallback({ section, q, page, pageSize, sortBy = 'publishedAt', from, to }) {
  const query = buildSectionQuery(section, q);
  return fetchEverything({ query, domains: UK_DOMAINS_PARAM, language: 'en', sortBy, from, to, page, pageSize });
}

/** Top headlines feed: `country=gb`, optionally scoped to a category. */
export async function getHeadlines(params) {
  const { category, q, pageSize } = params;
  const cacheKey = newsHeadlinesKey(params);
  const section = category ? PROVIDER_CATEGORY_TO_APP_SECTION[category] : undefined;

  return withCache(cacheKey, CACHE_TTL.NEWS_HEADLINES, '[news/headlines] upstream error', async () => {
    const raw = await getUKHeadlines({ category, query: q, page: 1, pageSize });
    if (raw.articles?.length > 0) {
      const articles = runPipeline(raw.articles, section);
      return toEnvelope(articles, raw.totalResults, 1, pageSize);
    }

    const fallback = await fetchUkFallback({ section, q, page: 1, pageSize });
    const articles = runPipeline(fallback.articles, section);
    return toEnvelope(articles, fallback.totalResults, 1, pageSize);
  });
}

/**
 * Article discovery/search. `business`/`health`/`tech`/`sport` are routed
 * to `/v2/top-headlines` (their real NewsAPI category) same as the
 * headlines feed, falling back to `/v2/everything` on an empty result (see
 * `fetchUkFallback`); `politics`/`world` and bare search go straight to
 * `/v2/everything`.
 */
export async function getEverything(params) {
  const { q, section, page, pageSize, sortBy, from, to } = params;
  const cacheKey = newsEverythingKey(params);
  const ttlMs = section ? CACHE_TTL.NEWS_SECTION : CACHE_TTL.NEWS_SEARCH;

  return withCache(cacheKey, ttlMs, '[news/everything] upstream error', async () => {
    if (section && HEADLINE_SECTIONS.has(section)) {
      const raw = await getUKHeadlines({
        category: APP_SECTION_TO_PROVIDER_CATEGORY[section],
        query: q,
        page,
        pageSize,
      });
      if (raw.articles?.length > 0) {
        const articles = runPipeline(raw.articles, section);
        return toEnvelope(articles, raw.totalResults, page, pageSize);
      }

      const fallback = await fetchUkFallback({ section, q, page, pageSize, sortBy, from, to });
      const articles = runPipeline(fallback.articles, section);
      return toEnvelope(articles, fallback.totalResults, page, pageSize);
    }

    const query = buildSectionQuery(section, q);
    const domains = NEWS_SECTION_QUERIES[section] ? UK_DOMAINS_PARAM : undefined;
    const raw = await fetchEverything({ query, domains, language: 'en', sortBy, from, to, page, pageSize });
    const articles = runPipeline(raw.articles, section);
    return toEnvelope(articles, raw.totalResults, page, pageSize);
  });
}

/** `GET /v2/top-headlines/sources` — cached for hours, not re-fetched per
 * request. */
export async function getSources(params) {
  const cacheKey = newsSourcesKey(params);

  return withCache(cacheKey, CACHE_TTL.NEWS_SOURCES, '[news/sources] upstream error', async () => {
    const raw = await fetchSources(params);
    return { status: 'ok', sources: normalizeSources(raw.sources) };
  });
}
