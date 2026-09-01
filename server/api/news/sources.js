import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseSourcesQuery } from '../../validators/newsValidator.js';
import { getSources } from '../../services/newsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  if (!getEnv().newsApiKey) {
    console.error('[news/sources] NEWS_API_KEY is not configured on the server.');
    res.status(500).json({
      error: true,
      code: 'NEWS_CONFIGURATION_ERROR',
      message: 'News service configuration is temporarily unavailable.',
    });
    return;
  }

  const params = parseSourcesQuery(req.query);
  const { status, body } = await getSources(params);
  res.status(status).json(body);
});
