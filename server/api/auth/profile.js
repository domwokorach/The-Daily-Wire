import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseProfileBody } from '../../validators/authValidator.js';
import { updateProfile } from '../../services/userService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parseProfileBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = updateProfile(req.user.id, parsed.params);
  res.status(status).json(body);
});
