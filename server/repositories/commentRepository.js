import crypto from 'node:crypto';
import { getDb } from '../db/connection.js';
import { toIsoUtc } from '../utils/sqliteDate.js';

export function listCommentsByArticle(articleId) {
  return getDb()
    .prepare(
      `SELECT * FROM comments WHERE article_id = ? AND is_deleted = 0 ORDER BY created_at ASC`,
    )
    .all(articleId);
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
