import crypto from 'node:crypto';
import { getDb } from '../db/connection.js';
import { toIsoUtc } from '../utils/sqliteDate.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function findByUserAndArticle(userId, articleId) {
  return getDb()
    .prepare('SELECT * FROM saved_articles WHERE user_id = ? AND article_id = ?')
    .get(userId, articleId);
}

export function findById(id) {
  return getDb().prepare('SELECT * FROM saved_articles WHERE id = ?').get(id);
}

/** `UNIQUE(user_id, article_id)` is the actual duplicate-save guard — this
 * `ON CONFLICT DO NOTHING` just makes a repeat save idempotent instead of
 * throwing, so the service layer can treat "already saved" as success. */
export function createSavedArticle({ userId, articleId, title, url, image, sourceName, category, publishedAt }) {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO saved_articles (id, user_id, article_id, title, url, image, source_name, category, published_at)
     VALUES (@id, @userId, @articleId, @title, @url, @image, @sourceName, @category, @publishedAt)
     ON CONFLICT(user_id, article_id) DO NOTHING`,
  ).run({ id, userId, articleId, title, url: url ?? null, image: image ?? null, sourceName: sourceName ?? null, category: category ?? null, publishedAt: publishedAt ?? null });

  return findByUserAndArticle(userId, articleId);
}

export function removeSavedArticle(userId, articleId) {
  getDb().prepare('DELETE FROM saved_articles WHERE user_id = ? AND article_id = ?').run(userId, articleId);
}

function encodeCursor(row) {
  return `${row.created_at}|${row.rowid}`;
}

function decodeCursor(cursor) {
  const separator = cursor.lastIndexOf('|');
  if (separator === -1) return null;
  const rowid = Number(cursor.slice(separator + 1));
  if (!Number.isInteger(rowid)) return null;
  return { createdAt: cursor.slice(0, separator), rowid };
}

/** Composite `created_at|rowid` cursor, not a plain timestamp — see the
 * same note in `commentRepository.js`; several saves within the same
 * second would otherwise collide on a timestamp-only cursor, and the
 * random-UUID `id` doesn't sort in insertion order the way `rowid` does. */
export function listByUser(userId, { limit = DEFAULT_PAGE_SIZE, cursor } = {}) {
  const boundedLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
  const db = getDb();
  const decoded = cursor ? decodeCursor(cursor) : null;
  const cursorClause = decoded ? 'AND (created_at, rowid) < (?, ?)' : '';
  const params = [userId];
  if (decoded) params.push(decoded.createdAt, decoded.rowid);
  params.push(boundedLimit + 1);

  const rows = db
    .prepare(
      `SELECT *, rowid FROM saved_articles WHERE user_id = ? ${cursorClause} ORDER BY created_at DESC, rowid DESC LIMIT ?`,
    )
    .all(...params);

  const hasMore = rows.length > boundedLimit;
  const page = hasMore ? rows.slice(0, boundedLimit) : rows;
  const nextCursor = hasMore ? encodeCursor(page[page.length - 1]) : null;

  return { rows: page, nextCursor };
}

export function deleteAllForUser(userId) {
  getDb().prepare('DELETE FROM saved_articles WHERE user_id = ?').run(userId);
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
    savedAt: toIsoUtc(row.created_at),
  };
}
