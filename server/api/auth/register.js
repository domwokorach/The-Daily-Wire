import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseRegisterBody } from '../../validators/authValidator.js';
import { register } from '../../services/authService.js';
import { setSessionCookie } from '../../utils/cookies.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseRegisterBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body, session } = await register(parsed.params, req.get('user-agent'));
  if (session) setSessionCookie(res, session.token, session.expiresAt);
  res.status(status).json(body);
});
