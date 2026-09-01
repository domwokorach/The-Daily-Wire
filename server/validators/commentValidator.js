import { sanitizeText } from '../utils/sanitize.js';

const BODY_MAX_LENGTH = 2000;

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

export function parseArticleIdParam(raw) {
  const articleId = sanitizeText(raw, 200);
  if (!articleId) return fail(400, 'INVALID_ARTICLE_ID', 'A valid article id is required.');
  return { ok: true, articleId };
}

export function parseCommentBody(body) {
  const text = sanitizeText(body.body, BODY_MAX_LENGTH);
  if (!text) return fail(422, 'EMPTY_COMMENT', 'Comment cannot be empty.');
  return { ok: true, params: { body: text } };
}
