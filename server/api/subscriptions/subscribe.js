import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseSubscribeBody } from '../../validators/subscriptionValidator.js';
import { subscribe } from '../../services/subscriptionService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseSubscribeBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  if (parsed.honeypot) {
    res.status(202).json({ message: "Check your inbox. We've sent you a link to confirm your subscription." });
    return;
  }

  const { status, body } = subscribe(parsed.params, req.user?.id ?? null);
  res.status(status).json(body);
});
