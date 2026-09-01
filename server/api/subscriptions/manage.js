import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseTokenQuery, parsePreferencesUpdateBody } from '../../validators/subscriptionValidator.js';
import { manageByToken, updatePreferencesByToken } from '../../services/subscriptionService.js';

export const getManagedSubscriptionRoute = asyncHandler(async (req, res) => {
  const parsed = parseTokenQuery(req.query || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await manageByToken(parsed.params.token);
  res.status(status).json(body);
});

export const updateManagedSubscriptionRoute = asyncHandler(async (req, res) => {
  const parsedToken = parseTokenBodyFromRequest(req.body || {});
  if (!parsedToken.ok) {
    res.status(parsedToken.status).json({ error: true, code: parsedToken.code, message: parsedToken.message });
    return;
  }

  const parsedPrefs = parsePreferencesUpdateBody(req.body || {});
  if (!parsedPrefs.ok) {
    res.status(parsedPrefs.status).json({ error: true, code: parsedPrefs.code, message: parsedPrefs.message });
    return;
  }

  const { status, body } = await updatePreferencesByToken(parsedToken.params.token, parsedPrefs.params.preferences);
  res.status(status).json(body);
});

function parseTokenBodyFromRequest(body) {
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token) return { ok: false, status: 400, code: 'MISSING_TOKEN', message: 'A valid token is required.' };
  return { ok: true, params: { token } };
}
