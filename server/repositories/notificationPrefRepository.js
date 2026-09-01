import { getDb } from '../db/connection.js';

const DEFAULTS = { categoriesCsv: '', pushEnabled: false, pushSubscription: null };

export function getPreferences(userId) {
  const row = getDb().prepare('SELECT * FROM notification_preferences WHERE user_id = ?').get(userId);
  if (!row) return { userId, ...DEFAULTS };
  return {
    userId,
    categoriesCsv: row.categories_csv,
    pushEnabled: Boolean(row.push_enabled),
    pushSubscription: row.push_subscription_json ? JSON.parse(row.push_subscription_json) : null,
  };
}

export function upsertPreferences(userId, { categories, pushEnabled }) {
  const db = getDb();
  const categoriesCsv = categories.join(',');
  db.prepare(
    `INSERT INTO notification_preferences (user_id, categories_csv, push_enabled, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       categories_csv = excluded.categories_csv,
       push_enabled = excluded.push_enabled,
       updated_at = datetime('now')`,
  ).run(userId, categoriesCsv, pushEnabled ? 1 : 0);
  return getPreferences(userId);
}

export function setPushSubscription(userId, subscription) {
  const db = getDb();
  db.prepare(
    `INSERT INTO notification_preferences (user_id, push_enabled, push_subscription_json, updated_at)
     VALUES (?, 1, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       push_enabled = 1,
       push_subscription_json = excluded.push_subscription_json,
       updated_at = datetime('now')`,
  ).run(userId, JSON.stringify(subscription));
}

export function clearPushSubscription(userId) {
  getDb()
    .prepare(
      `UPDATE notification_preferences SET push_enabled = 0, push_subscription_json = NULL, updated_at = datetime('now')
       WHERE user_id = ?`,
    )
    .run(userId);
}

export function listPushSubscribers() {
  return getDb()
    .prepare(
      `SELECT user_id, categories_csv, push_subscription_json FROM notification_preferences
       WHERE push_enabled = 1 AND push_subscription_json IS NOT NULL`,
    )
    .all()
    .map((row) => ({
      userId: row.user_id,
      categories: row.categories_csv ? row.categories_csv.split(',') : [],
      subscription: JSON.parse(row.push_subscription_json),
    }));
}
