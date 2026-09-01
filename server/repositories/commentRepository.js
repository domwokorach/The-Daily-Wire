import crypto from 'node:crypto';
import { getDb } from '../db/connection.js';
import { toIsoUtc } from '../utils/sqliteDate.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

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

/** Cursor-paginated, newest-or-oldest-first — never the whole thread at
 * once. The cursor is `created_at|rowid` (a row-value tuple comparison),
 * not just `created_at` — SQLite's `datetime('now')` is second-precision,
 * so several comments posted within the same second would otherwise
 * collide on a plain timestamp cursor and either duplicate or skip rows.
 * SQLite's implicit `rowid` (not the random-UUID `id`) is what actually
 * breaks the tie in insertion order — a UUID sorts lexicographically, not
 * chronologically. */
export function listCommentsByArticle(articleId, { limit = DEFAULT_PAGE_SIZE, cursor, sort = 'newest' } = {}) {
  const boundedLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
  const db = getDb();
  const direction = sort === 'oldest' ? 'ASC' : 'DESC';
  const decoded = cursor ? decodeCursor(cursor) : null;
  const cursorClause = decoded ? `AND (created_at, rowid) ${sort === 'oldest' ? '>' : '<'} (?, ?)` : '';
  const params = [articleId];
  if (decoded) params.push(decoded.createdAt, decoded.rowid);
  params.push(boundedLimit + 1);

  const rows = db
    .prepare(
      `SELECT *, rowid FROM comments
       WHERE article_id = ? AND is_deleted = 0 AND status = 'visible' ${cursorClause}
       ORDER BY created_at ${direction}, rowid ${direction}
       LIMIT ?`,
    )
    .all(...params);

  const hasMore = rows.length > boundedLimit;
  const page = hasMore ? rows.slice(0, boundedLimit) : rows;
  const nextCursor = hasMore ? encodeCursor(page[page.length - 1]) : null;

  return { rows: page, nextCursor };
}

export function countByArticle(articleId) {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as count FROM comments WHERE article_id = ? AND is_deleted = 0 AND status = 'visible'`)
    .get(articleId);
  return row.count;
}

export function findCommentById(id) {
  return getDb().prepare('SELECT * FROM comments WHERE id = ? AND is_deleted = 0').get(id);
}

export function createComment({ articleId, userId, authorName, body }) {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO comments (id, article_id, user_id, author_name_snapshot, body)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, articleId, userId, authorName, body);
  return findCommentById(id);
}

export function updateComment(id, body) {
  getDb()
    .prepare(`UPDATE comments SET body = ?, edited_at = datetime('now') WHERE id = ?`)
    .run(body, id);
  return findCommentById(id);
}

export function deleteComment(id) {
  getDb().prepare('UPDATE comments SET is_deleted = 1 WHERE id = ?').run(id);
}

export function toPublicComment(comment) {
  return {
    id: comment.id,
    articleId: comment.article_id,
    author: {
      id: comment.user_id,
      displayName: comment.author_name_snapshot,
    },
    body: comment.body,
    createdAt: toIsoUtc(comment.created_at),
    updatedAt: toIsoUtc(comment.edited_at || comment.created_at),
    edited: Boolean(comment.edited_at),
  };
}
