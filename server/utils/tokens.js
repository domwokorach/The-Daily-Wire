import crypto from 'node:crypto';

/** Generates a random opaque token and its SHA-256 hash. The raw token is
 * what's handed to the client (cookie, email link); only the hash is ever
 * persisted, so a leaked database never exposes usable session/reset tokens. */
export function generateToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  return { raw, hashed: hashToken(raw) };
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
