// Shared request-parameter sanitizers for News API routes. Every value that
// reaches an upstream News API request must pass through one of these —
// nothing from `req.query` is forwarded as-is.

function stripControlChars(raw) {
  let cleaned = '';
  for (const char of raw) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x20 && code !== 0x7f) cleaned += char;
  }
  return cleaned;
}

export function sanitizeText(raw, maxLength) {
  if (typeof raw !== 'string') return undefined;
  const cleaned = stripControlChars(raw).trim().slice(0, maxLength);
  return cleaned.length > 0 ? cleaned : undefined;
}

export function sanitizeEnum(raw, allowed) {
  if (typeof raw !== 'string') return undefined;
  const lower = raw.trim().toLowerCase();
  return allowed.has(lower) ? lower : undefined;
}

/** Parses a comma-separated list and keeps only entries present in `allowed`
 * (a `Set` or an array). */
export function sanitizeAllowlistCsv(raw, allowed) {
  if (typeof raw !== 'string') return undefined;
  const isMember = (value) => (allowed.has ? allowed.has(value) : allowed.includes(value));
  const values = raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(isMember);
  return values.length > 0 ? [...new Set(values)] : undefined;
}

export function sanitizeInt(raw, { min, max, fallback }) {
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

/**
 * Validates a News API `from`/`to` style date. Accepts `YYYY-MM-DD` or a
 * full ISO 8601 timestamp; rejects anything else (including non-date
 * garbage that would otherwise be forwarded straight to the upstream API).
 */
export function sanitizeIsoDate(raw) {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  // Accepts `YYYY-MM-DD` or a full ISO 8601 timestamp, with or without
  // milliseconds (e.g. `Date.prototype.toISOString()`'s `.SSS` output).
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/.test(trimmed)) {
    return undefined;
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? undefined : trimmed;
}
