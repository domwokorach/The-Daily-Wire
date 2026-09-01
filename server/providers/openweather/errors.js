// Maps OpenWeather's upstream error codes/statuses to safe, generic
// messages and HTTP statuses. Never forwards the raw upstream `message`
// (which can echo the request, including the API key itself) to the client.

const SAFE_MESSAGES = {
  UNAUTHORIZED: 'Weather service configuration is unavailable.',
  NOT_FOUND: "We couldn't find that location. Try another UK town, city or postcode.",
  RATE_LIMITED: 'Weather updates are temporarily unavailable. Please try again shortly.',
  BAD_REQUEST: 'The weather request could not be completed.',
  UNKNOWN: 'Unable to load weather data right now.',
};

const STATUS_BY_CODE = {
  UNAUTHORIZED: 500,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  BAD_REQUEST: 400,
};

/** Classifies an upstream OpenWeather HTTP status into a safe internal code. */
export function classifyOpenWeatherStatus(status) {
  if (status === 401 || status === 403) return 'UNAUTHORIZED';
  if (status === 404) return 'NOT_FOUND';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 400) return 'BAD_REQUEST';
  return 'UNKNOWN';
}

export function getSafeWeatherErrorMessage(code) {
  return SAFE_MESSAGES[code] ?? SAFE_MESSAGES.UNKNOWN;
}

export function getSafeWeatherErrorStatus(code) {
  return STATUS_BY_CODE[code] ?? 502;
}

export class OpenWeatherError extends Error {
  constructor(code, upstreamStatus, upstreamMessage) {
    super(upstreamMessage || code);
    this.name = 'OpenWeatherError';
    this.code = code;
    this.upstreamStatus = upstreamStatus;
  }
}

export function createOpenWeatherError(upstreamStatus, body) {
  const code = classifyOpenWeatherStatus(upstreamStatus);
  const upstreamMessage = typeof body?.message === 'string' ? body.message : undefined;
  return new OpenWeatherError(code, upstreamStatus, upstreamMessage);
}
