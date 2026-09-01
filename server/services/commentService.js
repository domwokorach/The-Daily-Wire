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

export async function listComments(articleId, { limit, cursor, sort } = {}) {
  const { rows, nextCursor } = await listCommentsByArticle(articleId, { limit, cursor, sort });
  return {
    status: 200,
    body: { comments: rows.map(toPublicComment), nextCursor, totalCount: await countByArticle(articleId) },
  };
}

export async function createComment(articleId, user, body, clientMutationId) {
  const comment = await createCommentRow({ articleId, userId: user.id, authorName: user.full_name, body });
  const publicComment = toPublicComment(comment);

  publishToArticle(articleId, commentCreatedEvent(articleId, publicComment, clientMutationId));

  return { status: 201, body: { comment: publicComment, clientMutationId } };
}

export async function updateComment(commentId, body) {
  const comment = await updateCommentRow(commentId, body);
  const publicComment = toPublicComment(comment);

  publishToArticle(comment.article_id, commentUpdatedEvent(comment.article_id, publicComment));

  return { status: 200, body: { comment: publicComment } };
}

export async function deleteComment(commentId) {
  const comment = await findCommentById(commentId);
  await deleteCommentRow(commentId);

  if (comment) publishToArticle(comment.article_id, commentDeletedEvent(comment.article_id, commentId));

  return { status: 204, body: null };
}
