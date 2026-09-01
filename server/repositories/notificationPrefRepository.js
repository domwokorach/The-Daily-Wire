import { query } from '../db/connection.js';

const DEFAULTS = { categoriesCsv: '', pushEnabled: false, pushSubscription: null };

export async function getPreferences(userId) {
  const { rows } = await query('SELECT * FROM notification_preferences WHERE user_id = $1', [userId]);
  const row = rows[0];
  if (!row) return { userId, ...DEFAULTS };
  return {
    userId,
    categoriesCsv: row.categories_csv,
    pushEnabled: Boolean(row.push_enabled),
    pushSubscription: row.push_subscription_json ? JSON.parse(row.push_subscription_json) : null,
  };
}

export async function upsertPreferences(userId, { categories, pushEnabled }) {
  const categoriesCsv = categories.join(',');
  await query(
    `INSERT INTO notification_preferences (user_id, categories_csv, push_enabled, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT(user_id) DO UPDATE SET
       categories_csv = excluded.categories_csv,
       push_enabled = excluded.push_enabled,
       updated_at = now()`,
    [userId, categoriesCsv, Boolean(pushEnabled)],
  );
  return getPreferences(userId);
}

export async function setPushSubscription(userId, subscription) {
  await query(
    `INSERT INTO notification_preferences (user_id, push_enabled, push_subscription_json, updated_at)
     VALUES ($1, TRUE, $2, now())
     ON CONFLICT(user_id) DO UPDATE SET
       push_enabled = TRUE,
       push_subscription_json = excluded.push_subscription_json,
       updated_at = now()`,
    [userId, JSON.stringify(subscription)],
  );
}

export async function clearPushSubscription(userId) {
  await query(
    `UPDATE notification_preferences SET push_enabled = FALSE, push_subscription_json = NULL, updated_at = now()
     WHERE user_id = $1`,
    [userId],
  );
}

export async function listPushSubscribers() {
  const { rows } = await query(
    `SELECT user_id, categories_csv, push_subscription_json FROM notification_preferences
     WHERE push_enabled = TRUE AND push_subscription_json IS NOT NULL`,
  );
  return rows.map((row) => ({
    userId: row.user_id,
    categories: row.categories_csv ? row.categories_csv.split(',') : [],
    subscription: JSON.parse(row.push_subscription_json),
  }));
}
