import { sanitizeText, sanitizeEnum, sanitizeInt, sanitizeIsoDate } from '../utils/sanitize.js';
import { NEWS_DEFAULT_PAGE_SIZE, NEWS_MAX_PAGE_SIZE } from '../config/news.js';

const ALLOWED_CATEGORIES = new Set(['business', 'general', 'health', 'sports', 'technology']);
const ALLOWED_SECTIONS = new Set(['politics', 'world', 'business', 'health', 'tech', 'sport']);
const ALLOWED_SORT = new Set(['publishedAt', 'relevancy', 'popularity']);
const Q_MAX_LENGTH = 500;

/**
 * Validates `/api/news` (top-headlines) query params. Everything here is
 * either sanitized or dropped — nothing from `req.query` reaches the
 * provider layer unvalidated. No hard-failure case: an unrecognised value
 * just falls back to a safe default rather than rejecting the request.
 */
export function parseHeadlinesQuery(query) {
  return {
    q: sanitizeText(query.q, 200),
    category: sanitizeEnum(query.category, ALLOWED_CATEGORIES),
    pageSize: sanitizeInt(query.pageSize, { min: 1, max: NEWS_MAX_PAGE_SIZE, fallback: NEWS_DEFAULT_PAGE_SIZE }),
  };
}

/**
 * Validates `/api/news/everything` query params. Returns `{ ok: false, ... }`
 * for requests that can't be safely completed (missing q/section) instead
 * of forwarding them upstream.
 */
export function parseEverythingQuery(query) {
  const q = sanitizeText(query.q, Q_MAX_LENGTH);
  const section = sanitizeEnum(query.section, ALLOWED_SECTIONS);
  const page = sanitizeInt(query.page, { min: 1, max: 100, fallback: 1 });
  const pageSize = sanitizeInt(query.pageSize, { min: 1, max: NEWS_MAX_PAGE_SIZE, fallback: NEWS_DEFAULT_PAGE_SIZE });
  const sortBy = sanitizeEnum(query.sortBy, ALLOWED_SORT) ?? 'publishedAt';
  const from = sanitizeIsoDate(query.from);
  const to = sanitizeIsoDate(query.to);

  if (!q && !section) {
    return {
      ok: false,
      status: 400,
      code: 'parametersMissing',
      message: 'A search term or section is required.',
    };
  }

  return { ok: true, params: { q, section, page, pageSize, sortBy, from, to } };
}

const SOURCE_CATEGORIES = new Set([
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
]);

/** Validates `/api/news/sources` query params. */
export function parseSourcesQuery(query) {
  return { category: sanitizeEnum(query.category, SOURCE_CATEGORIES) };
}
