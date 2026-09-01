import { query } from '../db/connection.js';
import { generateToken, hashToken } from '../utils/tokens.js';

const RESET_TTL_MS = 30 * 60 * 1000;
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

export async function createPasswordResetToken(userId) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();
  await query('INSERT INTO password_reset_tokens (id, user_id, expires_at) VALUES ($1, $2, $3)', [hashed, userId, expiresAt]);
  return raw;
}

export async function consumePasswordResetToken(rawToken) {
  const hashed = hashToken(rawToken);
  const { rows } = await query('SELECT * FROM password_reset_tokens WHERE id = $1', [hashed]);
  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  await query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [hashed]);
  return row;
}

export async function createEmailVerificationToken(userId, targetEmail) {
  const { raw, hashed } = generateToken();
  const expiresAt = new Date(Date.now() + VERIFY_TTL_MS).toISOString();
  await query(
    'INSERT INTO email_verification_tokens (id, user_id, target_email, expires_at) VALUES ($1, $2, $3, $4)',
    [hashed, userId, targetEmail, expiresAt],
  );
  return raw;
}

export async function consumeEmailVerificationToken(rawToken) {
  const hashed = hashToken(rawToken);
  const { rows } = await query('SELECT * FROM email_verification_tokens WHERE id = $1', [hashed]);
  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  await query('UPDATE email_verification_tokens SET used_at = now() WHERE id = $1', [hashed]);
  return row;
}
