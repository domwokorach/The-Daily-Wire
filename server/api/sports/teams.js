import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseTeamsQuery } from '../../validators/sportsValidator.js';
import { getTeams } from '../../services/sportsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  if (!getEnv().sportsApiKey) {
    console.error('[sports/teams] SPORTS_API_KEY is not configured on the server.');
    res
      .status(500)
      .json({ error: true, code: 'SPORTS_SERVICE_ERROR', message: 'Sport service configuration is unavailable.' });
    return;
  }

  const params = parseTeamsQuery(req.query);
  const { status, body } = await getTeams(params);
  res.status(status).json(body);
});
