import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, code: 'RATE_LIMITED', message: 'Too many attempts. Try again later.' },
});

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // Keyed by user id (this route always runs after `requireAuth`), not IP —
  // otherwise multiple signed-in users behind the same NAT/office IP would
  // share one bucket. `ipKeyGenerator` normalizes the IPv6 fallback so one
  // /64 can't be trivially rotated to dodge the limit.
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
  message: { error: true, code: 'RATE_LIMITED', message: 'You are commenting too quickly. Slow down and try again.' },
});

export const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, code: 'RATE_LIMITED', message: 'Too many subscription attempts. Try again later.' },
});

export const savedArticlesLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
  message: { error: true, code: 'RATE_LIMITED', message: 'Too many requests. Slow down and try again.' },
});

export const resendConfirmationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, code: 'RATE_LIMITED', message: 'Too many attempts. Try again later.' },
});
