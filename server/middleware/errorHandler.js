import { getEnv } from '../config/env.js';

/** Wraps an async route handler so a rejected promise reaches `errorHandler`
 * instead of crashing the process or hanging the request. */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Catches anything not already mapped to a safe response by a service layer
 * (network failures, timeouts, unexpected exceptions — a mapped upstream
 * News API error never reaches here, see `newsService.js`). Never leaks a
 * stack trace, provider detail, or credential to the client — `err.message`
 * for an unexpected Node/fetch failure (e.g. "fetch failed", an abort
 * reason) is safe on its own, but only shown in development.
 */
export function errorHandler(err, _req, res, _next) {
  console.error('[server] unhandled error', err);
  if (res.headersSent) return;
  res.status(502).json({
    error: true,
    code: 'NEWS_SERVICE_ERROR',
    message: 'Unable to load the latest news right now.',
    ...(getEnv().isProduction ? {} : { devMessage: err?.message }),
  });
}
