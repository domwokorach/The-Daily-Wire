import { asyncHandler } from '../../middleware/errorHandler.js';
import { parsePushSubscriptionBody } from '../../validators/notificationValidator.js';
import { subscribePush } from '../../services/notificationService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parsePushSubscriptionBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = subscribePush(req.user.id, parsed.params.subscription);
  res.status(status).json(body);
});
