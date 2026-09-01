import { sanitizeAllowlistCsv } from '../utils/sanitize.js';

const ALLOWED_CATEGORIES = new Set(['politics', 'world', 'business', 'health', 'tech', 'sport']);

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

export function parsePreferencesBody(body) {
  const categoriesRaw = Array.isArray(body.categories) ? body.categories.join(',') : body.categories;
  const categories = sanitizeAllowlistCsv(String(categoriesRaw ?? ''), ALLOWED_CATEGORIES) || [];
  const pushEnabled = Boolean(body.pushEnabled);
  return { ok: true, params: { categories, pushEnabled } };
}

export function parsePushSubscriptionBody(body) {
  const subscription = body?.subscription;
  if (!subscription || typeof subscription.endpoint !== 'string' || !subscription.keys) {
    return fail(422, 'INVALID_SUBSCRIPTION', 'A valid push subscription is required.');
  }
  return { ok: true, params: { subscription } };
}
