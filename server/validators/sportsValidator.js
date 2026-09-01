import { sanitizeIsoDate, sanitizeInt } from '../utils/sanitize.js';
import { DEFAULT_LEAGUE_ID, CURRENT_FOOTBALL_SEASON } from '../config/sports.js';

const MAX_RESULTS_DAYS = 30;

function parseLeague(raw) {
  return sanitizeInt(raw, { min: 1, max: 9999, fallback: DEFAULT_LEAGUE_ID });
}

function parseSeason(raw) {
  return sanitizeInt(raw, { min: 2000, max: 2100, fallback: CURRENT_FOOTBALL_SEASON });
}

/** `date`, when present, must be a plain `YYYY-MM-DD` (API-Football's own
 * format) — a full timestamp is rejected rather than silently truncated. */
function parseDate(raw) {
  if (raw === undefined) return undefined;
  const iso = sanitizeIsoDate(raw);
  return iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : undefined;
}

export function parseLiveQuery(query) {
  return { league: parseLeague(query.league) };
}

export function parseFixturesQuery(query) {
  return {
    league: parseLeague(query.league),
    season: parseSeason(query.season),
    date: parseDate(query.date),
    team: query.team !== undefined ? sanitizeInt(query.team, { min: 1, max: 999999, fallback: undefined }) : undefined,
  };
}

export function parseResultsQuery(query) {
  return {
    league: parseLeague(query.league),
    season: parseSeason(query.season),
    days: sanitizeInt(query.days, { min: 1, max: MAX_RESULTS_DAYS, fallback: 14 }),
  };
}

export function parseStandingsQuery(query) {
  return { league: parseLeague(query.league), season: parseSeason(query.season) };
}

export function parseTeamsQuery(query) {
  return { league: parseLeague(query.league), season: parseSeason(query.season) };
}

export function parseTopScorersQuery(query) {
  return { league: parseLeague(query.league), season: parseSeason(query.season) };
}

/** Returns `{ ok: false, ... }` for a missing/invalid fixture id instead of
 * forwarding it upstream. */
export function parseMatchIdParam(rawId) {
  const id = sanitizeInt(rawId, { min: 1, max: Number.MAX_SAFE_INTEGER, fallback: undefined });
  if (!id) {
    return { ok: false, status: 400, code: 'InvalidFixtureId', message: 'A valid match id is required.' };
  }
  return { ok: true, id };
}
