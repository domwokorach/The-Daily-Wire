import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseArticleIdParam, parseCommentBody } from '../../validators/commentValidator.js';
import { createComment } from '../../services/commentService.js';

export default asyncHandler(async (req, res) => {
  const parsedArticle = parseArticleIdParam(req.params.articleId);
  if (!parsedArticle.ok) {
    res.status(parsedArticle.status).json({ error: true, code: parsedArticle.code, message: parsedArticle.message });
    return;
  }

  const parsedBody = parseCommentBody(req.body || {});
  if (!parsedBody.ok) {
    res.status(parsedBody.status).json({ error: true, code: parsedBody.code, message: parsedBody.message });
    return;
  }

  const { status, body } = createComment(
    parsedArticle.articleId,
    req.user,
    parsedBody.params.body,
    parsedBody.params.clientMutationId,
  );
  res.status(status).json(body);
});
