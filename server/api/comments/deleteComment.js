import { asyncHandler } from '../../middleware/errorHandler.js';
import { deleteComment } from '../../services/commentService.js';

export default asyncHandler(async (req, res) => {
  const { status } = await deleteComment(req.comment.id);
  res.status(status).end();
});
