import { getDb } from '../db/connection.js';
import { generateToken, hashToken } from '../utils/tokens.js';

const RESET_TTL_MS = 30 * 60 * 1000;
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

export function createPasswordResetToken(userId) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();
  getDb()
    .prepare('INSERT INTO password_reset_tokens (id, user_id, expires_at) VALUES (?, ?, ?)')
    .run(hashed, userId, expiresAt);
  return raw;
}

export function consumePasswordResetToken(rawToken) {
  const hashed = hashToken(rawToken);
  const db = getDb();
  const row = db.prepare('SELECT * FROM password_reset_tokens WHERE id = ?').get(hashed);
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  db.prepare(`UPDATE password_reset_tokens SET used_at = datetime('now') WHERE id = ?`).run(hashed);
  return row;
}

export function createEmailVerificationToken(userId, targetEmail) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + VERIFY_TTL_MS).toISOString();
  getDb()
    .prepare('INSERT INTO email_verification_tokens (id, user_id, target_email, expires_at) VALUES (?, ?, ?, ?)')
    .run(hashed, userId, targetEmail, expiresAt);
  return raw;
}

export function consumeEmailVerificationToken(rawToken) {
  const hashed = hashToken(rawToken);
  const db = getDb();
  const row = db.prepare('SELECT * FROM email_verification_tokens WHERE id = ?').get(hashed);
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  db.prepare(`UPDATE email_verification_tokens SET used_at = datetime('now') WHERE id = ?`).run(hashed);
  return row;
}
