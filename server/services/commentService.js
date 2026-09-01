import {
  listCommentsByArticle,
  createComment as createCommentRow,
  updateComment as updateCommentRow,
  deleteComment as deleteCommentRow,
  toPublicComment,
} from '../repositories/commentRepository.js';

export function listComments(articleId) {
  const comments = listCommentsByArticle(articleId).map(toPublicComment);
  return { status: 200, body: { comments } };
}

export function createComment(articleId, user, body) {
  const comment = createCommentRow({ articleId, userId: user.id, authorName: user.full_name, body });
  return { status: 201, body: { comment: toPublicComment(comment) } };
}

export function updateComment(commentId, body) {
  const comment = updateCommentRow(commentId, body);
  return { status: 200, body: { comment: toPublicComment(comment) } };
}

export function deleteComment(commentId) {
  deleteCommentRow(commentId);
  return { status: 204, body: null };
}
