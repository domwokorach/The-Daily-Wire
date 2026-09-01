import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseMatchIdParam } from '../../validators/sportsValidator.js';
import { getMatchDetail } from '../../services/sportsService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  if (!getEnv().sportsApiKey) {
    console.error('[sports/match] SPORTS_API_KEY is not configured on the server.');
    res
      .status(500)
      .json({ error: true, code: 'SPORTS_SERVICE_ERROR', message: 'Sport service configuration is unavailable.' });
    return;
  }

  const parsed = parseMatchIdParam(req.params.id);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await getMatchDetail(parsed.id);
  res.status(status).json(body);
});
