import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/requireAuth.js';
import { subscribeLimiter, resendConfirmationLimiter } from '../../middleware/rateLimit.js';
import subscribeRoute from './subscribe.js';
import confirmRoute from './confirm.js';
import resendConfirmationRoute from './resendConfirmation.js';
import { getPreferencesRoute, updatePreferencesRoute } from './preferences.js';
import { getManagedSubscriptionRoute, updateManagedSubscriptionRoute } from './manage.js';
import { unsubscribeRoute, resubscribeRoute } from './unsubscribe.js';

const router = Router();

router.post('/', optionalAuth, subscribeLimiter, subscribeRoute);
router.post('/confirm', confirmRoute);
router.post('/resend-confirmation', resendConfirmationLimiter, resendConfirmationRoute);

router.get('/preferences', requireAuth, getPreferencesRoute);
router.patch('/preferences', requireAuth, updatePreferencesRoute);

router.get('/manage', getManagedSubscriptionRoute);
router.patch('/manage', updateManagedSubscriptionRoute);

router.post('/unsubscribe', subscribeLimiter, unsubscribeRoute);
router.post('/resubscribe', subscribeLimiter, resubscribeRoute);

export default router;
