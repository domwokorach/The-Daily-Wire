import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseTokenBody } from '../../validators/subscriptionValidator.js';
import { confirmSubscription } from '../../services/subscriptionService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseTokenBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = confirmSubscription(parsed.params.token);
  res.status(status).json(body);
});
