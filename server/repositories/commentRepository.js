import crypto from 'node:crypto';
import { query } from '../db/connection.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

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

/** Cursor-paginated, newest-or-oldest-first — never the whole thread at
 * once. The cursor is `created_at|seq` (a row-value tuple comparison), not
 * just `created_at` — several comments posted within the same instant
 * would otherwise collide on a plain timestamp cursor and either
 * duplicate or skip rows. The `seq` column (a BIGSERIAL) is what actually
 * breaks the tie in insertion order — a UUID sorts lexicographically, not
 * chronologically. */
export async function listCommentsByArticle(articleId, { limit = DEFAULT_PAGE_SIZE, cursor, sort = 'newest' } = {}) {
  const boundedLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
  const direction = sort === 'oldest' ? 'ASC' : 'DESC';
  const decoded = cursor ? decodeCursor(cursor) : null;
  const cursorClause = decoded ? `AND (created_at, seq) ${sort === 'oldest' ? '>' : '<'} ($2, $3)` : '';
  const params = [articleId];
  if (decoded) params.push(decoded.createdAt, decoded.seq);
  params.push(boundedLimit + 1);

  const { rows } = await query(
    `SELECT * FROM comments
     WHERE article_id = $1 AND is_deleted = FALSE AND status = 'visible' ${cursorClause}
     ORDER BY created_at ${direction}, seq ${direction}
     LIMIT $${params.length}`,
    params,
  );

  const hasMore = rows.length > boundedLimit;
  const page = hasMore ? rows.slice(0, boundedLimit) : rows;
  const nextCursor = hasMore ? encodeCursor(page[page.length - 1]) : null;

  return { rows: page, nextCursor };
}

export async function countByArticle(articleId) {
  const { rows } = await query(
    `SELECT COUNT(*) as count FROM comments WHERE article_id = $1 AND is_deleted = FALSE AND status = 'visible'`,
    [articleId],
  );
  return Number(rows[0].count);
}

export async function findCommentById(id) {
  const { rows } = await query('SELECT * FROM comments WHERE id = $1 AND is_deleted = FALSE', [id]);
  return rows[0] || null;
}

export async function createComment({ articleId, userId, authorName, body }) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO comments (id, article_id, user_id, author_name_snapshot, body)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, articleId, userId, authorName, body],
  );
  return findCommentById(id);
}

export async function updateComment(id, body) {
  await query(`UPDATE comments SET body = $1, edited_at = now() WHERE id = $2`, [body, id]);
  return findCommentById(id);
}

export async function deleteComment(id) {
  await query('UPDATE comments SET is_deleted = TRUE WHERE id = $1', [id]);
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
    createdAt: comment.created_at.toISOString(),
    updatedAt: (comment.edited_at || comment.created_at).toISOString(),
    edited: Boolean(comment.edited_at),
  };
}
