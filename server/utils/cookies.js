import { getEnv } from '../config/env.js';

export function setSessionCookie(res, token, expiresAt) {
  const env = getEnv();
  res.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });
}

export function clearSessionCookie(res) {
  const env = getEnv();
  res.clearCookie(env.sessionCookieName, { path: '/' });
}
