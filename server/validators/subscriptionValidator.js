import { sanitizeText } from '../utils/sanitize.js';
import { PREFERENCE_KEYS } from '../repositories/subscriptionRepository.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

/** Only known preference keys survive; unknown fields are dropped and every
 * surviving value is coerced to a strict boolean — never trusts the
 * frontend's shape or types directly. */
function parsePreferences(raw) {
  const preferences = {};
  const source = raw && typeof raw === 'object' ? raw : {};
  for (const key of PREFERENCE_KEYS) {
    preferences[key] = source[key] === undefined ? undefined : Boolean(source[key]);
  }
  return preferences;
}

/** Missing keys default to a conservative starting point (daily digest on,
 * everything else off) rather than silently opting a new subscriber into
 * every category. */
function applyDefaults(preferences) {
  const resolved = {};
  for (const key of PREFERENCE_KEYS) {
    if (preferences[key] !== undefined) {
      resolved[key] = preferences[key];
    } else {
      resolved[key] = key === 'dailyDigest';
    }
  }
  return resolved;
}

export function parseSubscribeBody(body) {
  const email = sanitizeText(body?.email, 254)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return fail(422, 'INVALID_EMAIL', 'Enter a valid email address.');

  // Honeypot: a hidden field real users never fill in. Silently accept the
  // request without creating anything so bots get no signal of rejection.
  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return { ok: true, honeypot: true, params: { email, preferences: applyDefaults({}) } };
  }

  const preferences = applyDefaults(parsePreferences(body?.preferences));
  return { ok: true, params: { email, preferences } };
}

export function parsePreferencesUpdateBody(body) {
  const preferences = parsePreferences(body?.preferences);
  const provided = PREFERENCE_KEYS.some((key) => preferences[key] !== undefined);
  if (!provided) return fail(422, 'NO_PREFERENCES', 'Select at least one preference to update.');
  return { ok: true, params: { preferences: applyDefaults(preferences) } };
}

export function parseTokenBody(body, field = 'token') {
  const token = sanitizeText(body?.[field], 200);
  if (!token) return fail(400, 'MISSING_TOKEN', 'A valid token is required.');
  return { ok: true, params: { token } };
}

export function parseTokenQuery(query, field = 'token') {
  const token = sanitizeText(query?.[field], 200);
  if (!token) return fail(400, 'MISSING_TOKEN', 'A valid token is required.');
  return { ok: true, params: { token } };
}

export function parseEmailBody(body) {
  const email = sanitizeText(body?.email, 254)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return fail(422, 'INVALID_EMAIL', 'Enter a valid email address.');
  return { ok: true, params: { email } };
}

export function parseUnsubscribeBody(body) {
  const token = sanitizeText(body?.token, 200);
  if (!token) return fail(400, 'MISSING_TOKEN', 'A valid token is required.');

  // `categories` is optional — omit it (or send an empty array) to
  // unsubscribe from everything; include category keys to turn off only
  // those, leaving the rest of the subscription active.
  let categories;
  if (Array.isArray(body?.categories)) {
    categories = body.categories.filter((key) => PREFERENCE_KEYS.includes(key));
  }
  return { ok: true, params: { token, categories } };
}
