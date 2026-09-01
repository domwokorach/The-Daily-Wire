import { asyncHandler } from '../../middleware/errorHandler.js';
import { parseUnsubscribeBody, parseTokenBody } from '../../validators/subscriptionValidator.js';
import { unsubscribeByToken, resubscribeByToken } from '../../services/subscriptionService.js';

export const unsubscribeRoute = asyncHandler(async (req, res) => {
  const parsed = parseUnsubscribeBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await unsubscribeByToken(parsed.params.token, parsed.params.categories);
  res.status(status).json(body);
});

export const resubscribeRoute = asyncHandler(async (req, res) => {
  const parsed = parseTokenBody(req.body || {});
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  const { status, body } = await resubscribeByToken(parsed.params.token);
  res.status(status).json(body);
});
