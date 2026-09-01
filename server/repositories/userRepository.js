import crypto from 'node:crypto';
import { query } from '../db/connection.js';

export async function createUser({ fullName, dateOfBirth, email, mobile, passwordHash }) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO users (id, full_name, date_of_birth, email, mobile, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, fullName, dateOfBirth, email, mobile, passwordHash],
  );
  return findUserById(id);
}

export async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function markEmailVerified(userId) {
  await query(
    `UPDATE users SET email_verified_at = now(), updated_at = now() WHERE id = $1`,
    [userId],
  );
}

export async function setPendingEmail(userId, pendingEmail) {
  await query(
    `UPDATE users SET pending_email = $1, updated_at = now() WHERE id = $2`,
    [pendingEmail, userId],
  );
}

export async function applyPendingEmail(userId, newEmail) {
  await query(
    `UPDATE users SET email = $1, pending_email = NULL, email_verified_at = now(), updated_at = now()
     WHERE id = $2`,
    [newEmail, userId],
  );
}

export async function updatePasswordHash(userId, passwordHash) {
  await query(`UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`, [passwordHash, userId]);
}

export async function updateProfile(userId, { fullName, dateOfBirth, mobile }) {
  await query(
    `UPDATE users SET full_name = $1, date_of_birth = $2, mobile = $3, updated_at = now() WHERE id = $4`,
    [fullName, dateOfBirth, mobile, userId],
  );
}

export async function anonymizeUserComments(userId) {
  await query(
    `UPDATE comments SET user_id = NULL, author_name_snapshot = 'Deleted User' WHERE user_id = $1`,
    [userId],
  );
}

export async function deleteUser(userId) {
  await query('DELETE FROM users WHERE id = $1', [userId]);
}

export function toSafeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    mobileNumber: user.mobile,
    dateOfBirth: user.date_of_birth,
    emailVerified: Boolean(user.email_verified_at),
    createdAt: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at,
  };
}
