import { sanitizeText, sanitizeIsoDate, sanitizeEnum, sanitizeInt } from '../utils/sanitize.js';

const CATEGORIES = new Set(['politics', 'world', 'business', 'health', 'tech', 'sport']);
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

function sanitizeHttpUrl(raw, maxLength) {
  const text = sanitizeText(raw, maxLength);
  if (!text) return undefined;
  try {
    const parsed = new URL(text);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? text : undefined;
  } catch {
    return undefined;
  }
}

export function parseArticleIdParam(raw) {
  const articleId = sanitizeText(raw, 200);
  if (!articleId) return fail(400, 'INVALID_ARTICLE_ID', 'A valid article id is required.');
  return { ok: true, articleId };
}

/** Only a minimal normalized snapshot is ever persisted — the frontend
 * supplies it (NewsData.io has no per-article lookup endpoint the server
 * could re-derive this from), but every field is sanitized/length-capped
 * and unknown fields are dropped, so nothing arbitrary reaches the
 * database under the authenticated user's row. */
export function parseSaveArticleBody(body) {
  const articleId = sanitizeText(body?.articleId, 200);
  if (!articleId) return fail(422, 'INVALID_ARTICLE_ID', 'A valid article id is required.');

  const title = sanitizeText(body?.title, 300);
  if (!title) return fail(422, 'INVALID_TITLE', 'An article title is required.');

  return {
    ok: true,
    params: {
      articleId,
      title,
      url: sanitizeHttpUrl(body?.url, 1000),
      image: sanitizeHttpUrl(body?.image, 1000),
      sourceName: sanitizeText(body?.sourceName, 200),
      category: sanitizeEnum(body?.category, CATEGORIES),
      publishedAt: sanitizeIsoDate(body?.publishedAt),
    },
  };
}

export function parseListSavedArticlesQuery(query) {
  const limit = sanitizeInt(query?.limit, { min: 1, max: MAX_PAGE_SIZE, fallback: DEFAULT_PAGE_SIZE });
  const cursor = sanitizeText(query?.cursor, 100);
  return { ok: true, params: { limit, cursor } };
}
