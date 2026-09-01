import {
  listCommentsByArticle,
  countByArticle,
  createComment as createCommentRow,
  updateComment as updateCommentRow,
  deleteComment as deleteCommentRow,
  findCommentById,
  toPublicComment,
} from '../repositories/commentRepository.js';
import { publishToArticle } from '../realtime/channels.js';
import { commentCreatedEvent, commentUpdatedEvent, commentDeletedEvent } from '../realtime/events.js';

export function listComments(articleId, { limit, cursor, sort } = {}) {
  const { rows, nextCursor } = listCommentsByArticle(articleId, { limit, cursor, sort });
  return {
    status: 200,
    body: { comments: rows.map(toPublicComment), nextCursor, totalCount: countByArticle(articleId) },
  };
}

export function createComment(articleId, user, body, clientMutationId) {
  const comment = createCommentRow({ articleId, userId: user.id, authorName: user.full_name, body });
  const publicComment = toPublicComment(comment);

  publishToArticle(articleId, commentCreatedEvent(articleId, publicComment, clientMutationId));

  return { status: 201, body: { comment: publicComment, clientMutationId } };
}

export function updateComment(commentId, body) {
  const comment = updateCommentRow(commentId, body);
  const publicComment = toPublicComment(comment);

  publishToArticle(comment.article_id, commentUpdatedEvent(comment.article_id, publicComment));

  return { status: 200, body: { comment: publicComment } };
}

export function deleteComment(commentId) {
  const comment = findCommentById(commentId);
  deleteCommentRow(commentId);

  if (comment) publishToArticle(comment.article_id, commentDeletedEvent(comment.article_id, commentId));

  return { status: 204, body: null };
}
