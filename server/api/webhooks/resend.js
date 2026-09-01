import { Webhook } from 'svix';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { getEnv } from '../../config/env.js';
import { handleBounce, handleComplaint } from '../../services/subscriptionService.js';
import { updateDeliveryStatusByProviderId } from '../../repositories/subscriptionRepository.js';

/**
 * Resend signs webhook payloads with svix, so verification needs the exact
 * raw request bytes — `req.rawBody` is stashed by the `express.json({verify})`
 * hook in `server/index.js` specifically for this route.
 */
export default asyncHandler(async (req, res) => {
  const secret = getEnv().resendWebhookSecret;
  if (!secret) {
    console.error('[webhooks/resend] RESEND_WEBHOOK_SECRET is not configured — rejecting webhook.');
    res.status(503).json({ error: true, code: 'WEBHOOK_NOT_CONFIGURED', message: 'Webhook not configured.' });
    return;
  }

  let event;
  try {
    const webhook = new Webhook(secret);
    event = webhook.verify(req.rawBody, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });
  } catch {
    res.status(400).json({ error: true, code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature.' });
    return;
  }

  const { type, data } = event;
  const email = data?.to?.[0];
  const providerEmailId = data?.email_id;

  switch (type) {
    case 'email.delivered':
      if (providerEmailId) updateDeliveryStatusByProviderId(providerEmailId, 'delivered');
      break;
    case 'email.bounced':
      if (providerEmailId) updateDeliveryStatusByProviderId(providerEmailId, 'bounced');
      if (email) handleBounce(email);
      break;
    case 'email.failed':
      if (providerEmailId) updateDeliveryStatusByProviderId(providerEmailId, 'failed');
      break;
    case 'email.complained':
      if (providerEmailId) updateDeliveryStatusByProviderId(providerEmailId, 'complained');
      if (email) handleComplaint(email);
      break;
    default:
      break;
  }

  res.status(200).json({ received: true });
});
