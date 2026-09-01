/** SQLite's `datetime('now')` returns `YYYY-MM-DD HH:MM:SS` in UTC with no
 * timezone marker — `new Date()` on the client would parse that as local
 * time. Normalize to a proper ISO 8601 UTC string before it ever leaves the
 * server. */
export function toIsoUtc(sqliteDatetime) {
  if (!sqliteDatetime) return null;
  return `${sqliteDatetime.replace(' ', 'T')}Z`;
}
