import { asyncHandler } from '../../middleware/errorHandler.js';
import { parsePreferencesBody } from '../../validators/notificationValidator.js';
import { updatePreferences } from '../../services/notificationService.js';

export default asyncHandler(async (req, res) => {
  const parsed = parsePreferencesBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await updatePreferences(req.user.id, parsed.params);
  res.status(status).json(body);
});
