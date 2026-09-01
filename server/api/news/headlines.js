import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseHeadlinesQuery } from '../../validators/newsValidator.js';
import { getHeadlines } from '../../services/newsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  const apiKey = getEnv().newsDataApiKey;
  if (!apiKey) {
    console.error('[news/headlines] NEWSDATA_API_KEY is not configured on the server.');
    res.status(500).json({ error: true, code: 'NEWS_SERVICE_ERROR', message: 'News service is not configured.' });
    return;
  }

  const params = parseHeadlinesQuery(req.query);
  const { status, body } = await getHeadlines(params, apiKey);
  res.status(status).json(body);
});
