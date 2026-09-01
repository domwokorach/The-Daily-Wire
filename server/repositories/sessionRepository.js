import { getDb } from '../db/connection.js';
import { generateToken, hashToken } from '../utils/tokens.js';
import { getEnv } from '../config/env.js';

export function createSession(userId, userAgent) {
  const { raw, hashed } = generateToken();
  const ttlMs = getEnv().sessionTtlDays * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  getDb()
    .prepare(
      `INSERT INTO sessions (id, user_id, expires_at, user_agent) VALUES (?, ?, ?, ?)`,
    )
    .run(hashed, userId, expiresAt, userAgent || null);

  return { token: raw, expiresAt };
}

export function findSessionByToken(rawToken) {
  const hashed = hashToken(rawToken);
  const session = getDb().prepare('SELECT * FROM sessions WHERE id = ?').get(hashed);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    deleteSessionById(hashed);
    return null;
  }
  return session;
}

export function touchSession(sessionId) {
  getDb().prepare(`UPDATE sessions SET last_seen_at = datetime('now') WHERE id = ?`).run(sessionId);
}

export function deleteSessionByToken(rawToken) {
  deleteSessionById(hashToken(rawToken));
}

export function deleteSessionById(sessionId) {
  getDb().prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function deleteAllSessionsForUser(userId) {
  getDb().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}
