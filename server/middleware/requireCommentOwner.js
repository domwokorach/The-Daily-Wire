import { findCommentById } from '../repositories/commentRepository.js';

/** Loads `req.params.commentId` and enforces ownership server-side — the
 * client hiding edit/delete buttons for non-owners is a UI nicety, not a
 * security boundary. */
export function requireCommentOwner(req, res, next) {
  const comment = findCommentById(req.params.commentId);
  if (!comment) {
    res.status(404).json({ error: true, code: 'COMMENT_NOT_FOUND', message: 'Comment not found.' });
    return;
  }
  if (comment.user_id !== req.user.id) {
    res.status(403).json({ error: true, code: 'FORBIDDEN', message: 'You can only manage your own comments.' });
    return;
  }
  req.comment = comment;
  next();
}
