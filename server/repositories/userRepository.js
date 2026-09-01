import crypto from 'node:crypto';
import { getDb } from '../db/connection.js';
import { toIsoUtc } from '../utils/sqliteDate.js';

export function createUser({ fullName, dateOfBirth, email, mobile, passwordHash }) {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO users (id, full_name, date_of_birth, email, mobile, password_hash)
     VALUES (@id, @fullName, @dateOfBirth, @email, @mobile, @passwordHash)`,
  ).run({ id, fullName, dateOfBirth, email, mobile, passwordHash });
  return findUserById(id);
}

export function findUserByEmail(email) {
  return getDb().prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
}

export function findUserById(id) {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function markEmailVerified(userId) {
  getDb()
    .prepare(`UPDATE users SET email_verified_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`)
    .run(userId);
}

export function setPendingEmail(userId, pendingEmail) {
  getDb()
    .prepare(`UPDATE users SET pending_email = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(pendingEmail, userId);
}

export function applyPendingEmail(userId, newEmail) {
  getDb()
    .prepare(
      `UPDATE users SET email = ?, pending_email = NULL, email_verified_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(newEmail, userId);
}

export function updatePasswordHash(userId, passwordHash) {
  getDb()
    .prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(passwordHash, userId);
}

export function updateProfile(userId, { fullName, dateOfBirth, mobile }) {
  getDb()
    .prepare(
      `UPDATE users SET full_name = ?, date_of_birth = ?, mobile = ?, updated_at = datetime('now') WHERE id = ?`,
    )
    .run(fullName, dateOfBirth, mobile, userId);
}

export function anonymizeUserComments(userId) {
  getDb()
    .prepare(`UPDATE comments SET user_id = NULL, author_name_snapshot = 'Deleted User' WHERE user_id = ?`)
    .run(userId);
}

export function deleteUser(userId) {
  getDb().prepare('DELETE FROM users WHERE id = ?').run(userId);
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
    createdAt: toIsoUtc(user.created_at),
  };
}
