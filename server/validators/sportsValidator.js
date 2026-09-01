import { sanitizeInt } from '../utils/sanitize.js';
import { DEFAULT_LEAGUE_ID, CURRENT_FOOTBALL_SEASON } from '../config/sports.js';

const MAX_WINDOW_DAYS = 30;

function parseLeague(raw) {
  return sanitizeInt(raw, { min: 1, max: 9999, fallback: DEFAULT_LEAGUE_ID });
}

function parseSeason(raw) {
  return sanitizeInt(raw, { min: 2000, max: 2100, fallback: CURRENT_FOOTBALL_SEASON });
}

export function parseLiveQuery(query) {
  return { league: parseLeague(query.league) };
}

/** `fixtures` = upcoming matches in the next `days` days (default 14) —
 * see `getFixtures` in `sportsService.js`. */
export function parseFixturesQuery(query) {
  return {
    league: parseLeague(query.league),
    season: parseSeason(query.season),
    days: sanitizeInt(query.days, { min: 1, max: MAX_WINDOW_DAYS, fallback: 14 }),
  };
}

export function parseResultsQuery(query) {
  return {
    league: parseLeague(query.league),
    season: parseSeason(query.season),
    days: sanitizeInt(query.days, { min: 1, max: MAX_WINDOW_DAYS, fallback: 14 }),
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
