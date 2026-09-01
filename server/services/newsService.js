import { fetchHeadlines, fetchSearch } from '../providers/newsdata/latest.js';
import { normalizeArticles } from '../providers/newsdata/normalizeArticle.js';
import { getSafeNewsErrorMessage, getSafeNewsErrorStatus, extractNewsDataError } from '../providers/newsdata/errors.js';
import { deduplicateArticles } from './newsDeduplication.js';
import { cacheGet, cacheSet } from '../cache/cacheClient.js';
import { newsHeadlinesKey, newsEverythingKey } from '../cache/cacheKeys.js';
import { CACHE_TTL } from '../cache/ttl.js';
import { getEnv } from '../config/env.js';

/**
 * normalize → dedupe → sort by recency. No classification/ranking stage —
 * NewsData.io's own category tagging is trusted directly (each article's
 * `section` is already resolved in `normalizeArticle`), since it natively
 * covers every app section (including politics/world, which News API had
 * no category for — that gap is what the old classifier existed to work
 * around).
 */
function runPipeline(rawArticles) {
  const normalized = normalizeArticles(rawArticles);
  const deduped = deduplicateArticles(normalized);
  return [...deduped].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

function toEnvelope(articles, nextPageToken) {
  return { status: 'ok', totalResults: articles.length, articles, nextPageToken: nextPageToken || undefined };
}

function upstreamErrorResponse(logLabel, result) {
  const { code, message } = extractNewsDataError(result.body);
  const safeCode = code ?? 'UnknownError';
  const status = getSafeNewsErrorStatus(safeCode, result.status);
  console.error(logLabel, result.status, safeCode, message);

  return {
    status,
    body: {
      error: true,
      code: safeCode,
      message: getSafeNewsErrorMessage(safeCode),
      ...(getEnv().isProduction ? {} : { provider: 'newsdata.io', upstreamStatus: result.status }),
    },
  };
}

/** Headlines feed: `country=gb`, optionally scoped to a category. */
export async function getHeadlines(params, apiKey) {
  const cacheKey = newsHeadlinesKey(params);
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  const result = await fetchHeadlines({ ...params, apiKey });

  if (!result.ok || result.body?.status === 'error') {
    return upstreamErrorResponse('[news/headlines] upstream error', result);
  }

  const articles = runPipeline(result.body?.results ?? []);
  const payload = toEnvelope(articles, result.body?.nextPage);
  cacheSet(cacheKey, payload, CACHE_TTL.NEWS);
  return { status: 200, body: payload };
}

/**
 * Article discovery/search via NewsData.io's `/latest`. `section` maps
 * directly to NewsData's own category (see `providers/newsdata/latest.js`)
 * — no server-owned query-string workaround needed.
 */
export async function getEverything(params, apiKey) {
  const cacheKey = newsEverythingKey(params);
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  const result = await fetchSearch({ ...params, apiKey });

  if (!result.ok || result.body?.status === 'error') {
    return upstreamErrorResponse('[news/everything] upstream error', result);
  }

  const articles = runPipeline(result.body?.results ?? []);
  const payload = toEnvelope(articles, result.body?.nextPage);
  cacheSet(cacheKey, payload, CACHE_TTL.NEWS);
  return { status: 200, body: payload };
}
