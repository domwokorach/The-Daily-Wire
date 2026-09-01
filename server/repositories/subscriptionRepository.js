import crypto from 'node:crypto';
import { getDb } from '../db/connection.js';
import { toIsoUtc } from '../utils/sqliteDate.js';
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

export function findSubscriptionByEmail(email) {
  return getDb()
    .prepare('SELECT * FROM subscriptions WHERE email = ? COLLATE NOCASE')
    .get(normalizeEmail(email));
}

export function findSubscriptionById(id) {
  return getDb().prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
}

export function findSubscriptionByUserId(userId) {
  return getDb().prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);
}

export function createSubscription({ email, userId = null, preferences }) {
  const db = getDb();
  const id = crypto.randomUUID();
  const columns = ['id', 'user_id', 'email', 'status'];
  const placeholders = ['@id', '@userId', '@email', "'pending'"];
  const params = { id, userId, email: normalizeEmail(email) };

  for (const key of PREFERENCE_KEYS) {
    const column = PREFERENCE_COLUMNS[key];
    columns.push(column);
    placeholders.push(`@${key}`);
    params[key] = preferences[key] ? 1 : 0;
  }

  db.prepare(`INSERT INTO subscriptions (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`).run(params);
  return findSubscriptionById(id);
}

export function updatePreferences(id, preferences) {
  const db = getDb();
  const assignments = PREFERENCE_KEYS.map((key) => `${PREFERENCE_COLUMNS[key]} = @${key}`).join(', ');
  const params = { id };
  for (const key of PREFERENCE_KEYS) params[key] = preferences[key] ? 1 : 0;

  db.prepare(`UPDATE subscriptions SET ${assignments}, updated_at = datetime('now') WHERE id = @id`).run(params);
  return findSubscriptionById(id);
}

export function linkUserId(id, userId) {
  getDb().prepare(`UPDATE subscriptions SET user_id = ?, updated_at = datetime('now') WHERE id = ?`).run(userId, id);
}

export function activateSubscription(id) {
  getDb()
    .prepare(
      `UPDATE subscriptions
       SET status = 'active', email_verified_at = datetime('now'), subscribed_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(id);
  return findSubscriptionById(id);
}

export function setStatus(id, status) {
  const unsubscribedAtClause = status === 'unsubscribed' ? `, unsubscribed_at = datetime('now')` : '';
  getDb()
    .prepare(`UPDATE subscriptions SET status = ?${unsubscribedAtClause}, updated_at = datetime('now') WHERE id = ?`)
    .run(status, id);
  return findSubscriptionById(id);
}

export function touchConfirmationSentAt(id) {
  getDb()
    .prepare(`UPDATE subscriptions SET last_confirmation_sent_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`)
    .run(id);
}

export function isWithinResendCooldown(subscription) {
  if (!subscription.last_confirmation_sent_at) return false;
  const lastSent = new Date(`${subscription.last_confirmation_sent_at.replace(' ', 'T')}Z`).getTime();
  return Date.now() - lastSent < RESEND_COOLDOWN_MS;
}

export function createConfirmationToken(subscriptionId) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + CONFIRMATION_TTL_MS).toISOString();
  getDb()
    .prepare('INSERT INTO subscription_confirmation_tokens (id, subscription_id, expires_at) VALUES (?, ?, ?)')
    .run(hashed, subscriptionId, expiresAt);
  return raw;
}

export function consumeConfirmationToken(rawToken) {
  const hashed = hashToken(rawToken);
  const db = getDb();
  const row = db.prepare('SELECT * FROM subscription_confirmation_tokens WHERE id = ?').get(hashed);
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  db.prepare(`UPDATE subscription_confirmation_tokens SET used_at = datetime('now') WHERE id = ?`).run(hashed);
  return row;
}

export function createManagementToken(subscriptionId) {
  const { raw, hashed } = generateToken();
  getDb()
    .prepare('INSERT INTO subscription_management_tokens (id, subscription_id) VALUES (?, ?)')
    .run(hashed, subscriptionId);
  return raw;
}

export function findByManagementToken(rawToken) {
  const hashed = hashToken(rawToken);
  const row = getDb()
    .prepare('SELECT * FROM subscription_management_tokens WHERE id = ? AND revoked_at IS NULL')
    .get(hashed);
  if (!row) return null;
  return findSubscriptionById(row.subscription_id);
}

export function revokeManagementTokens(subscriptionId) {
  getDb()
    .prepare(`UPDATE subscription_management_tokens SET revoked_at = datetime('now') WHERE subscription_id = ? AND revoked_at IS NULL`)
    .run(subscriptionId);
}

const CATEGORY_COLUMN_ALLOWLIST = new Set(['daily_digest', 'weekly_digest', 'breaking_news']);

export function listActiveSubscribersByColumn(column, { afterId = null, limit = 200 } = {}) {
  if (!CATEGORY_COLUMN_ALLOWLIST.has(column)) {
    throw new Error(`listActiveSubscribersByColumn: unsupported column "${column}"`);
  }
  const db = getDb();
  if (afterId) {
    return db
      .prepare(
        `SELECT * FROM subscriptions WHERE status = 'active' AND ${column} = 1 AND id > ? ORDER BY id ASC LIMIT ?`,
      )
      .all(afterId, limit);
  }
  return db
    .prepare(`SELECT * FROM subscriptions WHERE status = 'active' AND ${column} = 1 ORDER BY id ASC LIMIT ?`)
    .all(limit);
}

export function hasDeliveryRecord(idempotencyKey) {
  return Boolean(getDb().prepare('SELECT 1 FROM subscription_email_log WHERE idempotency_key = ?').get(idempotencyKey));
}

export function recordDelivery({ subscriptionId, emailType, articleId = null, idempotencyKey, providerEmailId = null, status = 'sent' }) {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO subscription_email_log (id, subscription_id, email_type, article_id, idempotency_key, provider_email_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(idempotency_key) DO NOTHING`,
  ).run(id, subscriptionId, emailType, articleId, idempotencyKey, providerEmailId, status);
}

export function updateDeliveryStatusByProviderId(providerEmailId, status) {
  getDb().prepare('UPDATE subscription_email_log SET status = ? WHERE provider_email_id = ?').run(status, providerEmailId);
}

export function toPublicSubscription(subscription) {
  if (!subscription) return null;
  const preferences = {};
  for (const key of PREFERENCE_KEYS) preferences[key] = Boolean(subscription[PREFERENCE_COLUMNS[key]]);

  return {
    id: subscription.id,
    email: subscription.email,
    status: subscription.status,
    preferences,
    emailVerified: Boolean(subscription.email_verified_at),
    subscribedAt: toIsoUtc(subscription.subscribed_at),
    unsubscribedAt: toIsoUtc(subscription.unsubscribed_at),
    createdAt: toIsoUtc(subscription.created_at),
  };
}
