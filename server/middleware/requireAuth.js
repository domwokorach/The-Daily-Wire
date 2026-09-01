import { getEnv } from '../config/env.js';
import { findSessionByToken, touchSession } from '../repositories/sessionRepository.js';
import { findUserById } from '../repositories/userRepository.js';

/** Resolves the session cookie into `req.user`/`req.session` when present and
 * valid. Never rejects the request — use `requireAuth` to enforce presence. */
export function optionalAuth(req, _res, next) {
  const token = req.cookies?.[getEnv().sessionCookieName];
  if (!token) return next();

  const session = findSessionByToken(token);
  if (!session) return next();

  const user = findUserById(session.user_id);
  if (!user) return next();

  touchSession(session.id);
  req.session = session;
  req.user = user;
  next();
}

export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) {
      res.status(401).json({ error: true, code: 'UNAUTHENTICATED', message: 'Sign in required.' });
      return;
    }
    next();
  });
}
