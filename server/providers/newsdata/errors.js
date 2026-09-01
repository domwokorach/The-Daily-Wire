// Maps NewsData.io's upstream error codes to safe, generic messages and
// HTTP statuses — mirrors the same safe-message pattern the News API
// integration used. Never forwards the raw upstream `message` (which can
// describe the key itself) to the client.

const SAFE_MESSAGES = {
  UnauthorizedAPIKey: 'News service configuration is invalid.',
  InvalidAPIKey: 'News service configuration is invalid.',
  KeyExpired: 'News service configuration is invalid.',
  RateLimitExceeded: 'The news service has reached its request limit.',
  ParameterMissing: 'The news request could not be completed.',
  UnknownError: 'Unable to load the latest news right now.',
};

const STATUS_BY_CODE = {
  UnauthorizedAPIKey: 500,
  InvalidAPIKey: 500,
  KeyExpired: 500,
  RateLimitExceeded: 429,
  ParameterMissing: 400,
};

export function getSafeNewsErrorMessage(code) {
  return SAFE_MESSAGES[code] ?? 'Unable to load the latest news right now.';
}

export function getSafeNewsErrorStatus(code, upstreamStatus) {
  if (code && STATUS_BY_CODE[code]) return STATUS_BY_CODE[code];
  if (upstreamStatus === 429) return 429;
  if (upstreamStatus === 401 || upstreamStatus === 403) return 500;
  return 502;
}

/** NewsData's error body shape wasn't fully confirmable from docs alone —
 * checks the couple of plausible nesting paths defensively. */
export function extractNewsDataError(body) {
  const code = body?.results?.code ?? body?.code ?? undefined;
  const message = body?.results?.message ?? body?.message ?? undefined;
  return { code, message };
}
