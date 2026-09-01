import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseSaveArticleBody } from '../../validators/savedArticleValidator.js';
import { saveArticle } from '../../services/savedArticleService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseSaveArticleBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  // `userId` always comes from the authenticated session (`requireAuth`),
  // never from the request body — the client cannot save on another
  // account's behalf.
  const { status, body } = await saveArticle(req.user.id, parsed.params);
  res.status(status).json(body);
});
