import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseResetPasswordBody } from '../../validators/authValidator.js';
import { resetPassword } from '../../services/authService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseResetPasswordBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await resetPassword(parsed.params.token, parsed.params.password);
  res.status(status).json(body);
});
