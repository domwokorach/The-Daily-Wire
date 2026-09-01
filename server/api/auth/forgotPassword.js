import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseForgotPasswordBody } from '../../validators/authValidator.js';
import { requestPasswordReset } from '../../services/authService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseForgotPasswordBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await requestPasswordReset(parsed.params.email);
  res.status(status).json(body);
});
