import { sanitizeText, sanitizeInt, sanitizeEnum } from '../utils/sanitize.js';

const BODY_MIN_LENGTH = 1;
const BODY_MAX_LENGTH = 2000;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const SORT_VALUES = new Set(['newest', 'oldest']);

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

export function parseArticleIdParam(raw) {
  const articleId = sanitizeText(raw, 200);
  if (!articleId) return fail(400, 'INVALID_ARTICLE_ID', 'A valid article id is required.');
  return { ok: true, articleId };
}

/** `sanitizeText` already strips control characters and enforces a max
 * length; the min-length check below is what actually rejects a
 * whitespace-only comment (it trims to empty and `sanitizeText` returns
 * `undefined` for that, so both cases share one message). */
export function parseCommentBody(body) {
  const text = sanitizeText(body.body, BODY_MAX_LENGTH);
  if (!text || text.length < BODY_MIN_LENGTH) return fail(422, 'EMPTY_COMMENT', 'Comment cannot be empty.');

  const clientMutationId = sanitizeText(body.clientMutationId, 100);
  return { ok: true, params: { body: text, clientMutationId } };
}

export function parseListCommentsQuery(query) {
  const limit = sanitizeInt(query?.limit, { min: 1, max: MAX_PAGE_SIZE, fallback: DEFAULT_PAGE_SIZE });
  const cursor = sanitizeText(query?.cursor, 100);
  const sort = sanitizeEnum(query?.sort, SORT_VALUES) ?? 'newest';
  return { ok: true, params: { limit, cursor, sort } };
}
