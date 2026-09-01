import { query } from '../db/connection.js';
import { generateToken, hashToken } from '../utils/tokens.js';
import { getEnv } from '../config/env.js';

export async function createSession(userId, userAgent) {
  const { raw, hashed } = generateToken();
  const ttlMs = getEnv().sessionTtlDays * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  await query(
    `INSERT INTO sessions (id, user_id, expires_at, user_agent) VALUES ($1, $2, $3, $4)`,
    [hashed, userId, expiresAt, userAgent || null],
  );

  return { token: raw, expiresAt };
}

export async function findSessionByToken(rawToken) {
  const hashed = hashToken(rawToken);
  const { rows } = await query('SELECT * FROM sessions WHERE id = $1', [hashed]);
  const session = rows[0];
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await deleteSessionById(hashed);
    return null;
  }
  return session;
}

export async function touchSession(sessionId) {
  await query(`UPDATE sessions SET last_seen_at = now() WHERE id = $1`, [sessionId]);
}

export async function deleteSessionByToken(rawToken) {
  await deleteSessionById(hashToken(rawToken));
}

export async function deleteSessionById(sessionId) {
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}

export async function deleteAllSessionsForUser(userId) {
  await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}
