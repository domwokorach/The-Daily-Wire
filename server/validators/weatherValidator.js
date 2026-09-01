import { sanitizeText } from '../utils/sanitize.js';

const Q_MAX_LENGTH = 200;

function parseCoordinate(raw, min, max) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) return undefined;
  return value;
}

/** Returns `{ ok: true, params: { latitude, longitude } }` or `{ ok: false,
 * ... }` — never forwards an out-of-range or non-numeric coordinate
 * upstream. */
export function parseCoordinatesQuery(query) {
  const latitude = parseCoordinate(query.lat, -90, 90);
  const longitude = parseCoordinate(query.lon, -180, 180);

  if (latitude === undefined || longitude === undefined) {
    return {
      ok: false,
      status: 400,
      code: 'InvalidCoordinates',
      message: 'A valid latitude and longitude are required.',
    };
  }

  return { ok: true, params: { latitude, longitude } };
}

/** UK-first search — a query with no country qualifier gets `,GB`
 * appended, matching the "prefer United Kingdom locations" requirement.
 * A query that already names a country (contains a comma) is left as-is. */
export function parseLocationSearchQuery(query) {
  const q = sanitizeText(query.q, Q_MAX_LENGTH);

  if (!q) {
    return {
      ok: false,
      status: 400,
      code: 'ParameterMissing',
      message: 'A search term is required.',
    };
  }

  const biasedQuery = q.includes(',') ? q : `${q},GB`;
  return { ok: true, params: { query: biasedQuery } };
}
