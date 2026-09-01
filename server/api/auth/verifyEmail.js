import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseVerifyEmailBody } from '../../validators/authValidator.js';
import { verifyEmail } from '../../services/authService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseVerifyEmailBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await verifyEmail(parsed.params.token);
  res.status(status).json(body);
});
