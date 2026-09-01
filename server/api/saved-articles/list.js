import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseListSavedArticlesQuery } from '../../validators/savedArticleValidator.js';
import { listSaved } from '../../services/savedArticleService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseListSavedArticlesQuery(req.query || {});
  const { status, body } = await listSaved(req.user.id, parsed.params);
  res.status(status).json(body);
});
