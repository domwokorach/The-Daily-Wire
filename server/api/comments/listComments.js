import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseArticleIdParam } from '../../validators/commentValidator.js';
import { listComments } from '../../services/commentService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseArticleIdParam(req.params.articleId);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = listComments(parsed.articleId);
  res.status(status).json(body);
});
