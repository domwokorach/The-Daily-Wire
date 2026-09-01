import crypto from 'node:crypto';
import { query } from '../db/connection.js';
import { generateToken, hashToken } from '../utils/tokens.js';

const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 60 * 1000;

export const PREFERENCE_KEYS = [
  'dailyDigest',
  'weeklyDigest',
  'breakingNews',
  'politics',
  'world',
  'business',
  'health',
  'tech',
  'sport',
];

const PREFERENCE_COLUMNS = {
  dailyDigest: 'daily_digest',
  weeklyDigest: 'weekly_digest',
  breakingNews: 'breaking_news',
  politics: 'politics',
  world: 'world',
  business: 'business',
  health: 'health',
  tech: 'tech',
  sport: 'sport',
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function findSubscriptionByEmail(email) {
  const { rows } = await query('SELECT * FROM subscriptions WHERE email = $1', [normalizeEmail(email)]);
  return rows[0] || null;
}

export async function findSubscriptionById(id) {
  const { rows } = await query('SELECT * FROM subscriptions WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function findSubscriptionByUserId(userId) {
  const { rows } = await query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
  return rows[0] || null;
}

export async function createSubscription({ email, userId = null, preferences }) {
  const id = crypto.randomUUID();
  const columns = ['id', 'user_id', 'email', 'status'];
  const values = [id, userId, normalizeEmail(email), 'pending'];

  for (const key of PREFERENCE_KEYS) {
    columns.push(PREFERENCE_COLUMNS[key]);
    values.push(Boolean(preferences[key]));
  }

  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  await query(`INSERT INTO subscriptions (${columns.join(', ')}) VALUES (${placeholders})`, values);
  return findSubscriptionById(id);
}

export async function updatePreferences(id, preferences) {
  const values = PREFERENCE_KEYS.map((key) => Boolean(preferences[key]));
  const assignments = PREFERENCE_KEYS.map((key, i) => `${PREFERENCE_COLUMNS[key]} = $${i + 1}`).join(', ');
  values.push(id);

  await query(`UPDATE subscriptions SET ${assignments}, updated_at = now() WHERE id = $${values.length}`, values);
  return findSubscriptionById(id);
}

export async function linkUserId(id, userId) {
  await query(`UPDATE subscriptions SET user_id = $1, updated_at = now() WHERE id = $2`, [userId, id]);
}

export async function activateSubscription(id) {
  await query(
    `UPDATE subscriptions
     SET status = 'active', email_verified_at = now(), subscribed_at = now(), updated_at = now()
     WHERE id = $1`,
    [id],
  );
  return findSubscriptionById(id);
}

export async function setStatus(id, status) {
  const unsubscribedAtClause = status === 'unsubscribed' ? `, unsubscribed_at = now()` : '';
  await query(`UPDATE subscriptions SET status = $1${unsubscribedAtClause}, updated_at = now() WHERE id = $2`, [status, id]);
  return findSubscriptionById(id);
}

export async function touchConfirmationSentAt(id) {
  await query(`UPDATE subscriptions SET last_confirmation_sent_at = now(), updated_at = now() WHERE id = $1`, [id]);
}

export function isWithinResendCooldown(subscription) {
  if (!subscription.last_confirmation_sent_at) return false;
  const lastSent = subscription.last_confirmation_sent_at.getTime();
  return Date.now() - lastSent < RESEND_COOLDOWN_MS;
}

export async function createConfirmationToken(subscriptionId) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + CONFIRMATION_TTL_MS).toISOString();
  await query(
    'INSERT INTO subscription_confirmation_tokens (id, subscription_id, expires_at) VALUES ($1, $2, $3)',
    [hashed, subscriptionId, expiresAt],
  );
  return raw;
}

export async function consumeConfirmationToken(rawToken) {
  const hashed = hashToken(rawToken);
  const { rows } = await query('SELECT * FROM subscription_confirmation_tokens WHERE id = $1', [hashed]);
  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  await query(`UPDATE subscription_confirmation_tokens SET used_at = now() WHERE id = $1`, [hashed]);
  return row;
}

export async function createManagementToken(subscriptionId) {
  const { raw, hashed } = generateToken();
  await query('INSERT INTO subscription_management_tokens (id, subscription_id) VALUES ($1, $2)', [hashed, subscriptionId]);
  return raw;
}

export async function findByManagementToken(rawToken) {
  const hashed = hashToken(rawToken);
  const { rows } = await query(
    'SELECT * FROM subscription_management_tokens WHERE id = $1 AND revoked_at IS NULL',
    [hashed],
  );
  const row = rows[0];
  if (!row) return null;
  return findSubscriptionById(row.subscription_id);
}

export async function revokeManagementTokens(subscriptionId) {
  await query(
    `UPDATE subscription_management_tokens SET revoked_at = now() WHERE subscription_id = $1 AND revoked_at IS NULL`,
    [subscriptionId],
  );
}

const CATEGORY_COLUMN_ALLOWLIST = new Set(['daily_digest', 'weekly_digest', 'breaking_news']);

export async function listActiveSubscribersByColumn(column, { afterId = null, limit = 200 } = {}) {
  if (!CATEGORY_COLUMN_ALLOWLIST.has(column)) {
    throw new Error(`listActiveSubscribersByColumn: unsupported column "${column}"`);
  }
  if (afterId) {
    const { rows } = await query(
      `SELECT * FROM subscriptions WHERE status = 'active' AND ${column} = TRUE AND id > $1 ORDER BY id ASC LIMIT $2`,
      [afterId, limit],
    );
    return rows;
  }
  const { rows } = await query(
    `SELECT * FROM subscriptions WHERE status = 'active' AND ${column} = TRUE ORDER BY id ASC LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function hasDeliveryRecord(idempotencyKey) {
  const { rows } = await query('SELECT 1 FROM subscription_email_log WHERE idempotency_key = $1', [idempotencyKey]);
  return rows.length > 0;
}

export async function recordDelivery({ subscriptionId, emailType, articleId = null, idempotencyKey, providerEmailId = null, status = 'sent' }) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO subscription_email_log (id, subscription_id, email_type, article_id, idempotency_key, provider_email_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT(idempotency_key) DO NOTHING`,
    [id, subscriptionId, emailType, articleId, idempotencyKey, providerEmailId, status],
  );
}

export async function updateDeliveryStatusByProviderId(providerEmailId, status) {
  await query('UPDATE subscription_email_log SET status = $1 WHERE provider_email_id = $2', [status, providerEmailId]);
}

export function toPublicSubscription(subscription) {
  if (!subscription) return null;
  const preferences = {};
  for (const key of PREFERENCE_KEYS) preferences[key] = Boolean(subscription[PREFERENCE_COLUMNS[key]]);

  const toIso = (value) => (value instanceof Date ? value.toISOString() : value);

  return {
    id: subscription.id,
    email: subscription.email,
    status: subscription.status,
    preferences,
    emailVerified: Boolean(subscription.email_verified_at),
    subscribedAt: toIso(subscription.subscribed_at),
    unsubscribedAt: toIso(subscription.unsubscribed_at),
    createdAt: toIso(subscription.created_at),
  };
}
