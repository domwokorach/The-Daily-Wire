import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/requireAuth.js';
import { getEnv } from '../../config/env.js';
import { publishBreakingAlert } from '../../services/notificationService.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import getPreferencesRoute from './getPreferences.js';
import updatePreferencesRoute from './updatePreferences.js';
import subscribePushRoute from './subscribePush.js';
import unsubscribePushRoute from './unsubscribePush.js';
import breakingStreamRoute from './breakingStream.js';

const router = Router();

router.get('/preferences', requireAuth, getPreferencesRoute);
router.put('/preferences', requireAuth, updatePreferencesRoute);
router.post('/push/subscribe', requireAuth, subscribePushRoute);
router.delete('/push/subscribe', requireAuth, unsubscribePushRoute);
router.get('/breaking/stream', optionalAuth, breakingStreamRoute);

// Local development only — publishes a fake breaking alert to every open SSE
// connection, so the popup/dedupe/push flow can be exercised without
// waiting on a real breaking story. Never reachable in production.
if (!getEnv().isProduction) {
  router.post('/breaking/test', asyncHandler(async (req, res) => {
    const id = `test-${Date.now()}`;
    await publishBreakingAlert({
      id,
      headline: req.body?.headline || 'Breaking: this is a test alert',
      summary: req.body?.summary || 'Triggered from the /api/notifications/breaking/test dev route.',
      category: req.body?.category || 'general',
      url: req.body?.url || `/article/${id}`,
      timestamp: new Date().toISOString(),
      breaking: true,
    });
    res.status(202).json({ published: true, id });
  }));
}

export default router;
