import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseChangeEmailBody } from '../../validators/authValidator.js';
import { requestEmailChange } from '../../services/authService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseChangeEmailBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await requestEmailChange(req.user.id, parsed.params);
  res.status(status).json(body);
});
