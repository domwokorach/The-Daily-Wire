import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseEmailBody } from '../../validators/subscriptionValidator.js';
import { resendConfirmation } from '../../services/subscriptionService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseEmailBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await resendConfirmation(parsed.params.email);
  res.status(status).json(body);
});
