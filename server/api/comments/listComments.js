import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseArticleIdParam, parseListCommentsQuery } from '../../validators/commentValidator.js';
import { listComments } from '../../services/commentService.js';

export default asyncHandler(async (req, res) => {
  const parsedArticle = parseArticleIdParam(req.params.articleId);
  if (!parsedArticle.ok) {
    res.status(parsedArticle.status).json({ error: true, code: parsedArticle.code, message: parsedArticle.message });
    return;
  }

  const parsedQuery = parseListCommentsQuery(req.query || {});
  const { status, body } = await listComments(parsedArticle.articleId, parsedQuery.params);
  res.status(status).json(body);
});
