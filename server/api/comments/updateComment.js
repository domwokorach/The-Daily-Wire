import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseCommentBody } from '../../validators/commentValidator.js';
import { updateComment } from '../../services/commentService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseCommentBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = updateComment(req.comment.id, parsed.params.body);
  res.status(status).json(body);
});
