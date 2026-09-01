import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseDeleteAccountBody } from '../../validators/authValidator.js';
import { deleteAccount } from '../../services/authService.js';
import { clearSessionCookie } from '../../utils/cookies.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseDeleteAccountBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await deleteAccount(req.user.id, parsed.params.currentPassword);
  if (status === 200) clearSessionCookie(res);
  res.status(status).json(body);
});
