import { Router } from 'express';
import { getEnv } from '../../config/env.js';
import currentRoute from './current.js';
import forecastRoute from './forecast.js';
import searchRoute from './search.js';

const router = Router();

// Local development only — never returns the key itself, only whether the
// server is configured. Must not be reachable in production.
if (!getEnv().isProduction) {
  router.get('/debug', (_req, res) => {
    res.status(200).json({
      configured: Boolean(getEnv().weatherApiKey),
      provider: 'openweathermap',
    });
  });
}

router.get('/current', currentRoute);
router.get('/forecast', forecastRoute);
router.get('/search', searchRoute);

export default router;
