// Maps NewsAPI.org's upstream error codes (and the client's own
// NEWS_CONFIGURATION_ERROR) to a small set of safe internal codes. Raw
// upstream codes/messages are never forwarded to the client — only logged
// server-side.

const CONFIGURATION_CODES = new Set(['apiKeyDisabled', 'apiKeyExhausted', 'apiKeyInvalid', 'apiKeyMissing']);
const INVALID_REQUEST_CODES = new Set(['parameterInvalid', 'parametersMissing', 'sourcesTooMany', 'sourceDoesNotExist']);

/** Reduces any thrown provider/client error into one of a handful of
 * internal codes the rest of the app understands. */
export function mapProviderErrorCode(err) {
  const code = err?.code;

  if (code === 'NEWS_CONFIGURATION_ERROR' || CONFIGURATION_CODES.has(code)) return 'NEWS_CONFIGURATION_ERROR';
  if (code === 'rateLimited' || err?.status === 429) return 'NEWS_RATE_LIMITED';
  if (INVALID_REQUEST_CODES.has(code)) return 'NEWS_INVALID_REQUEST';
  if (err?.status === 401 || err?.status === 403) return 'NEWS_CONFIGURATION_ERROR';
  if (err?.status >= 500 || !err?.status) return 'NEWS_TEMPORARILY_UNAVAILABLE';
  return 'NEWS_PROVIDER_ERROR';
}

const SAFE_MESSAGES = {
  NEWS_CONFIGURATION_ERROR: 'News service configuration is temporarily unavailable.',
  NEWS_RATE_LIMITED: 'The news service has reached its request limit.',
  NEWS_INVALID_REQUEST: 'The news request could not be completed.',
  NEWS_PROVIDER_ERROR: 'Unable to load the latest news right now.',
  NEWS_TEMPORARILY_UNAVAILABLE: 'Unable to load the latest news right now.',
};

export function getSafeNewsErrorMessage(internalCode) {
  return SAFE_MESSAGES[internalCode] ?? SAFE_MESSAGES.NEWS_PROVIDER_ERROR;
}

const STATUS_BY_INTERNAL_CODE = {
  NEWS_CONFIGURATION_ERROR: 500,
  NEWS_RATE_LIMITED: 429,
  NEWS_INVALID_REQUEST: 400,
  NEWS_PROVIDER_ERROR: 502,
  NEWS_TEMPORARILY_UNAVAILABLE: 502,
};

export function getSafeNewsErrorStatus(internalCode) {
  return STATUS_BY_INTERNAL_CODE[internalCode] ?? 502;
}
