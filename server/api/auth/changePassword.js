import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseChangePasswordBody } from '../../validators/authValidator.js';
import { changePassword } from '../../services/authService.js';
import { setSessionCookie } from '../../utils/cookies.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseChangePasswordBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body, session } = await changePassword(req.user.id, parsed.params);
  if (session) setSessionCookie(res, session.token, session.expiresAt);
  res.status(status).json(body);
});
