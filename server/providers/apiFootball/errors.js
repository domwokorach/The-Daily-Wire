// Maps API-Football's upstream failures — HTTP-level and its own in-body
// `errors` field (API-Football returns HTTP 200 even for a bad key or an
// exhausted quota, with the actual problem described in `errors`) — to
// safe, generic messages. Never forwards the raw upstream message (which
// can describe the key/plan) to the client.

const SAFE_MESSAGES = {
  UNAUTHORIZED: 'Sport service configuration is unavailable.',
  RATE_LIMITED: 'Sport updates are temporarily unavailable. Please try again shortly.',
  NOT_FOUND: 'That match or competition could not be found.',
  BAD_REQUEST: 'The sport request could not be completed.',
  UNKNOWN: 'Unable to load sport data right now.',
};

const STATUS_BY_CODE = {
  UNAUTHORIZED: 500,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
};

export function getSafeSportsErrorMessage(code) {
  return SAFE_MESSAGES[code] ?? SAFE_MESSAGES.UNKNOWN;
}

export function getSafeSportsErrorStatus(code) {
  return STATUS_BY_CODE[code] ?? 502;
}

export class ApiFootballError extends Error {
  constructor(code, upstreamStatus, upstreamMessage) {
    super(upstreamMessage || code);
    this.name = 'ApiFootballError';
    this.code = code;
    this.upstreamStatus = upstreamStatus;
  }
}

function classifyMessage(message) {
  const lower = message.toLowerCase();
  if (lower.includes('token') || lower.includes('key') || lower.includes('subscription')) return 'UNAUTHORIZED';
  if (lower.includes('request') && (lower.includes('limit') || lower.includes('too many'))) return 'RATE_LIMITED';
  return 'BAD_REQUEST';
}

/** `errors` can be an array of strings or an object keyed by field name,
 * depending on the endpoint. */
export function extractApiFootballErrors(body) {
  const errors = body?.errors;
  if (Array.isArray(errors)) return errors.filter((value) => typeof value === 'string');
  if (errors && typeof errors === 'object') return Object.values(errors).filter((value) => typeof value === 'string');
  return [];
}

export function createApiFootballError(httpStatus, body) {
  if (httpStatus === 401 || httpStatus === 403) return new ApiFootballError('UNAUTHORIZED', httpStatus);
  if (httpStatus === 429) return new ApiFootballError('RATE_LIMITED', httpStatus);
  if (httpStatus === 404) return new ApiFootballError('NOT_FOUND', httpStatus);
  if (httpStatus >= 500) return new ApiFootballError('UNKNOWN', httpStatus);

  const [firstError] = extractApiFootballErrors(body);
  if (firstError) return new ApiFootballError(classifyMessage(firstError), httpStatus, firstError);

  return new ApiFootballError('BAD_REQUEST', httpStatus);
}
