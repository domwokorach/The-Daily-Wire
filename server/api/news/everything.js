import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseEverythingQuery } from '../../validators/newsValidator.js';
import { getEverything } from '../../services/newsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  const apiKey = getEnv().newsDataApiKey;
  if (!apiKey) {
    console.error('[news/everything] NEWSDATA_API_KEY is not configured on the server.');
    res.status(500).json({ error: true, code: 'NEWS_SERVICE_ERROR', message: 'News service is not configured.' });
    return;
  }

  const parsed = parseEverythingQuery(req.query);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await getEverything(parsed.params, apiKey);
  res.status(status).json(body);
});
