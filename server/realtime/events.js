export const COMMENT_CREATED = 'comment.created';
export const COMMENT_UPDATED = 'comment.updated';
export const COMMENT_DELETED = 'comment.deleted';

export function commentCreatedEvent(articleId, comment, clientMutationId) {
  return { type: COMMENT_CREATED, articleId, comment, clientMutationId: clientMutationId ?? undefined };
}

export function commentUpdatedEvent(articleId, comment) {
  return { type: COMMENT_UPDATED, articleId, comment };
}

export function commentDeletedEvent(articleId, commentId) {
  return { type: COMMENT_DELETED, articleId, commentId };
}
