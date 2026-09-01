import { asyncHandler } from '../../middleware/errorHandler.js';
import { parsePreferencesUpdateBody } from '../../validators/subscriptionValidator.js';
import { getPreferencesForUser, updatePreferencesForUser } from '../../services/subscriptionService.js';

export const getPreferencesRoute = asyncHandler(async (req, res) => {
  const { status, body } = getPreferencesForUser(req.user.id);
  res.status(status).json(body);
});

export const updatePreferencesRoute = asyncHandler(async (req, res) => {
  const parsed = parsePreferencesUpdateBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = updatePreferencesForUser(req.user.id, req.user.email, parsed.params.preferences);
  res.status(status).json(body);
});
