import crypto from 'node:crypto';
import { query } from '../db/connection.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export async function findByUserAndArticle(userId, articleId) {
  const { rows } = await query(
    'SELECT * FROM saved_articles WHERE user_id = $1 AND article_id = $2',
    [userId, articleId],
  );
  return rows[0] || null;
}

export async function findById(id) {
  const { rows } = await query('SELECT * FROM saved_articles WHERE id = $1', [id]);
  return rows[0] || null;
}

/** `UNIQUE(user_id, article_id)` is the actual duplicate-save guard — this
 * `ON CONFLICT DO NOTHING` just makes a repeat save idempotent instead of
 * throwing, so the service layer can treat "already saved" as success. */
export async function createSavedArticle({ userId, articleId, title, url, image, sourceName, category, publishedAt }) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO saved_articles (id, user_id, article_id, title, url, image, source_name, category, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT(user_id, article_id) DO NOTHING`,
    [id, userId, articleId, title, url ?? null, image ?? null, sourceName ?? null, category ?? null, publishedAt ?? null],
  );

  return findByUserAndArticle(userId, articleId);
}

export async function removeSavedArticle(userId, articleId) {
  await query('DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2', [userId, articleId]);
}

function encodeCursor(row) {
  return `${row.created_at.toISOString()}|${row.seq}`;
}

function decodeCursor(cursor) {
  const separator = cursor.lastIndexOf('|');
  if (separator === -1) return null;
  const seq = Number(cursor.slice(separator + 1));
  if (!Number.isInteger(seq)) return null;
  return { createdAt: cursor.slice(0, separator), seq };
}

/** Composite `created_at|seq` cursor, not a plain timestamp — see the same
 * note in `commentRepository.js`; several saves within the same instant
 * would otherwise collide on a timestamp-only cursor, and the random-UUID
 * `id` doesn't sort in insertion order the way the `seq` BIGSERIAL does. */
export async function listByUser(userId, { limit = DEFAULT_PAGE_SIZE, cursor } = {}) {
  const boundedLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
  const decoded = cursor ? decodeCursor(cursor) : null;
  const cursorClause = decoded ? 'AND (created_at, seq) < ($2, $3)' : '';
  const params = [userId];
  if (decoded) params.push(decoded.createdAt, decoded.seq);
  params.push(boundedLimit + 1);

  const { rows } = await query(
    `SELECT * FROM saved_articles WHERE user_id = $1 ${cursorClause} ORDER BY created_at DESC, seq DESC LIMIT $${params.length}`,
    params,
  );

  const hasMore = rows.length > boundedLimit;
  const page = hasMore ? rows.slice(0, boundedLimit) : rows;
  const nextCursor = hasMore ? encodeCursor(page[page.length - 1]) : null;

  return { rows: page, nextCursor };
}

export async function deleteAllForUser(userId) {
  await query('DELETE FROM saved_articles WHERE user_id = $1', [userId]);
}

export function toPublicSavedArticle(row) {
  if (!row) return null;
  return {
    id: row.id,
    articleId: row.article_id,
    title: row.title,
    url: row.url,
    image: row.image,
    sourceName: row.source_name,
    category: row.category,
    publishedAt: row.published_at,
    savedAt: row.created_at.toISOString(),
  };
}
