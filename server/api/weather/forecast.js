import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseCoordinatesQuery } from '../../validators/weatherValidator.js';
import { getForecast } from '../../services/weatherService.js';
import { getEnv } from '../../config/env.js';

export default asyncHandler(async (req, res) => {
  if (!getEnv().weatherApiKey) {
    console.error('[weather/forecast] WEATHER_API_KEY is not configured on the server.');
    res
      .status(500)
      .json({ error: true, code: 'WEATHER_SERVICE_ERROR', message: 'Weather service configuration is unavailable.' });
    return;
  }

  const parsed = parseCoordinatesQuery(req.query);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await getForecast(parsed.params);
  res.status(status).json(body);
});
