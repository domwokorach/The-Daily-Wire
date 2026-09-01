/**
 * Validates a `returnTo` value as an internal path only — never an absolute
 * URL, protocol-relative URL, or anything else that could redirect a user
 * off-site after login (an open-redirect vector). Used both when building
 * `/login?returnTo=...` links and when consuming that param after a
 * successful sign-in.
 */
export function sanitizeReturnTo(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Must start with exactly one leading slash — `//evil.com` and
  // `https://evil.com` are both rejected by this alone.
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  if (raw.includes('://')) return null;
  return raw;
}

const ARTICLE_ID_PATTERN = /^\/article\/([^/?#]+)/;

/** Extracts the article id from a `returnTo` path, if it points at an
 * article page — used to resolve which article a pending post-login
 * "save" action applies to. */
export function extractArticleIdFromReturnTo(returnTo: string): string | null {
  const match = ARTICLE_ID_PATTERN.exec(returnTo);
  return match ? decodeURIComponent(match[1]) : null;
}
