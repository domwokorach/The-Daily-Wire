import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseFixturesQuery } from '../../validators/sportsValidator.js';
import { getFixtures } from '../../services/sportsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  if (!getEnv().sportsApiKey) {
    console.error('[sports/fixtures] SPORTS_API_KEY is not configured on the server.');
    res
      .status(500)
      .json({ error: true, code: 'SPORTS_SERVICE_ERROR', message: 'Sport service configuration is unavailable.' });
    return;
  }

  const params = parseFixturesQuery(req.query);
  const { status, body } = await getFixtures(params);
  res.status(status).json(body);
});
