import { Router } from 'express';
import { getEnv } from '../../config/env.js';
import { UK_COUNTRY_CODE } from '../../config/ukNewsSources.js';
import headlinesRoute from './headlines.js';
import everythingRoute from './everything.js';

const router = Router();

// Local development only — never returns the key itself, only whether the
// server is configured. Must not be reachable in production.
if (!getEnv().isProduction) {
  router.get('/debug', (_req, res) => {
    res.status(200).json({
      configured: Boolean(getEnv().newsDataApiKey),
      provider: 'newsdata.io',
      country: UK_COUNTRY_CODE,
    });
  });
}

router.get('/everything', everythingRoute);
router.get('/', headlinesRoute);

export default router;
