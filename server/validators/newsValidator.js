import { sanitizeText, sanitizeEnum, sanitizeInt, sanitizeIsoDate } from '../utils/sanitize.js';

const ALLOWED_CATEGORIES = new Set(['business', 'general', 'health', 'sports', 'technology']);
const ALLOWED_SECTIONS = new Set(['politics', 'world', 'business', 'health', 'tech', 'sport']);
const Q_MAX_LENGTH = 500;

// NewsData.io's free tier caps `size` (articles per request) at 10.
const MAX_PAGE_SIZE = 10;

/**
 * Validates `/api/news` (headlines) query params. Everything here is
 * either sanitized or dropped — nothing from `req.query` reaches the
 * provider layer unvalidated. No hard-failure case: an unrecognised value
 * just falls back to a safe default rather than rejecting the request.
 */
export function parseHeadlinesQuery(query) {
  return {
    q: sanitizeText(query.q, 200),
    category: sanitizeEnum(query.category, ALLOWED_CATEGORIES),
    pageSize: sanitizeInt(query.pageSize, { min: 1, max: MAX_PAGE_SIZE, fallback: MAX_PAGE_SIZE }),
  };
}

/**
 * Validates `/api/news/everything` query params. Returns `{ ok: false, ... }`
 * for requests that can't be safely completed (missing q/section) instead
 * of forwarding them upstream.
 *
 * `page`, when present, is an opaque `nextPage` cursor token from a
 * previous response — passed through as text, never parsed as a number.
 * `from`/`to` have no free-tier NewsData.io equivalent (no arbitrary
 * historical range); a `from` within the last 48h converts to `timeframe`
 * (hours since `from`) best-effort, otherwise it's silently ignored rather
 * than rejected.
 */
export function parseEverythingQuery(query) {
  const q = sanitizeText(query.q, Q_MAX_LENGTH);
  const section = sanitizeEnum(query.section, ALLOWED_SECTIONS);
  const page = sanitizeText(query.page, 500);
  const pageSize = sanitizeInt(query.pageSize, { min: 1, max: MAX_PAGE_SIZE, fallback: MAX_PAGE_SIZE });

  let timeframe;
  if (query.from !== undefined) {
    const from = sanitizeIsoDate(query.from);
    const fromMs = from ? Date.parse(from) : NaN;
    const hoursAgo = Number.isFinite(fromMs) ? Math.ceil((Date.now() - fromMs) / (60 * 60 * 1000)) : NaN;
    if (Number.isFinite(hoursAgo) && hoursAgo >= 1 && hoursAgo <= 48) {
      timeframe = String(hoursAgo);
    }
  }

  if (!q && !section) {
    return {
      ok: false,
      status: 400,
      code: 'ParameterMissing',
      message: 'A search term or section is required.',
    };
  }

  return { ok: true, params: { q, section, timeframe, page, pageSize } };
}
