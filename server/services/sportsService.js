import {
  fetchLiveFixtures,
  fetchRecentFixtures,
  fetchUpcomingFixtures,
  fetchFixtureById,
  fetchFixtureEvents,
  fetchFixtureLineups,
  fetchFixtureStatistics,
} from '../providers/apiFootball/fixtures.js';
import { fetchStandings } from '../providers/apiFootball/standings.js';
import { fetchTeams } from '../providers/apiFootball/teams.js';
import { fetchTopScorers } from '../providers/apiFootball/players.js';
import { normalizeFixtures, normalizeFixture } from '../providers/apiFootball/normalizeFixture.js';
import { normalizeStandings } from '../providers/apiFootball/normalizeStandings.js';
import { normalizeTeams } from '../providers/apiFootball/normalizeTeam.js';
import { normalizeTopScorers } from '../providers/apiFootball/normalizeTopScorers.js';
import { normalizeEvents, normalizeLineups, normalizeStatistics } from '../providers/apiFootball/normalizeMatchDetail.js';
import { ApiFootballError, getSafeSportsErrorMessage, getSafeSportsErrorStatus } from '../providers/apiFootball/errors.js';
import { cacheGet, cacheGetStale, cacheSet } from '../cache/cacheClient.js';
import {
  sportsLiveKey,
  sportsFixturesKey,
  sportsResultsKey,
  sportsStandingsKey,
  sportsTeamsKey,
  sportsTopScorersKey,
  sportsMatchKey,
} from '../cache/cacheKeys.js';
import { CACHE_TTL } from '../cache/ttl.js';
import { getEnv } from '../config/env.js';

function toSafeErrorResponse(logLabel, err) {
  if (err instanceof ApiFootballError) {
    console.error(logLabel, err.upstreamStatus, err.code, err.message);
    return {
      status: getSafeSportsErrorStatus(err.code),
      body: {
        error: true,
        code: err.code,
        message: getSafeSportsErrorMessage(err.code),
        ...(getEnv().isProduction ? {} : { provider: 'api-football', upstreamStatus: err.upstreamStatus }),
      },
    };
  }

  console.error(logLabel, err);
  return {
    status: 502,
    body: {
      error: true,
      code: 'SPORTS_SERVICE_ERROR',
      message: 'Unable to load sport data right now.',
      ...(getEnv().isProduction ? {} : { devMessage: err?.message }),
    },
  };
}

// How long a stale (TTL-expired) cache entry is still trusted enough to
// serve as a fallback when the upstream provider errors (e.g. free-plan
// quota exhausted) — long enough to ride out a rate limit, short enough
// that a live score doesn't sit stale for a whole news cycle.
const STALE_FALLBACK_MAX_AGE_MS = 6 * 60 * 60 * 1000;

async function withCache(cacheKey, ttl, load) {
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  try {
    const body = await load();
    cacheSet(cacheKey, body, ttl);
    return { status: 200, body };
  } catch (err) {
    const stale = cacheGetStale(cacheKey, STALE_FALLBACK_MAX_AGE_MS);
    if (stale) {
      console.warn('[sports] upstream failed, serving stale cache for', cacheKey, err?.message);
      return { status: 200, body: stale };
    }
    throw err;
  }
}

export async function getLiveMatches({ league }) {
  try {
    return await withCache(sportsLiveKey({ league }), CACHE_TTL.SPORTS_LIVE, async () => {
      const raw = await fetchLiveFixtures({ league });
      return { fixtures: normalizeFixtures(raw?.response) };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/live] upstream error', err);
  }
}

function toDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function byKickoffAscending(a, b) {
  return Date.parse(a.kickoff ?? 0) - Date.parse(b.kickoff ?? 0);
}

const MAX_RESULTS = 10;
const MAX_UPCOMING = 10;

/** Results = finished fixtures in a trailing date window (`days` back from
 * today), not `status=finished` alone — narrowing by date keeps the
 * request/response small and avoids scanning an entire season. Newest
 * first, capped to a handful of matches — never a full-season dump. */
export async function getResults({ league, season, days }) {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const cacheKey = sportsResultsKey({ league, season, days, to: toDateOnly(to) });

  try {
    return await withCache(cacheKey, CACHE_TTL.SPORTS_RESULTS, async () => {
      const raw = await fetchRecentFixtures({ league, season, from: toDateOnly(from), to: toDateOnly(to) });
      const fixtures = normalizeFixtures(raw?.response)
        .filter((fixture) => fixture.status.code === 'finished')
        .sort(byKickoffAscending)
        .reverse()
        .slice(0, MAX_RESULTS);
      return { fixtures };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/results] upstream error', err);
  }
}

/** Fixtures = upcoming, not-yet-started matches in a forward-looking date
 * window (`days` ahead of today) — the mirror image of `getResults`.
 * Nearest match first, capped to a handful — never past results, never a
 * full-season dump. */
export async function getFixtures({ league, season, days }) {
  const from = new Date();
  const to = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
  const cacheKey = sportsFixturesKey({ league, season, days, from: toDateOnly(from) });

  try {
    return await withCache(cacheKey, CACHE_TTL.SPORTS_FIXTURES, async () => {
      const raw = await fetchUpcomingFixtures({ league, season, from: toDateOnly(from), to: toDateOnly(to) });
      const fixtures = normalizeFixtures(raw?.response)
        .filter((fixture) => fixture.status.code === 'scheduled')
        .sort(byKickoffAscending)
        .slice(0, MAX_UPCOMING);
      return { fixtures };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/fixtures] upstream error', err);
  }
}

export async function getStandings({ league, season }) {
  try {
    return await withCache(sportsStandingsKey({ league, season }), CACHE_TTL.SPORTS_STANDINGS, async () => {
      const raw = await fetchStandings({ league, season });
      return { standings: normalizeStandings(raw?.response) };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/standings] upstream error', err);
  }
}

export async function getTeams({ league, season }) {
  try {
    return await withCache(sportsTeamsKey({ league, season }), CACHE_TTL.SPORTS_TEAMS, async () => {
      const raw = await fetchTeams({ league, season });
      return { teams: normalizeTeams(raw?.response) };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/teams] upstream error', err);
  }
}

export async function getTopScorers({ league, season }) {
  try {
    return await withCache(sportsTopScorersKey({ league, season }), CACHE_TTL.SPORTS_TOP_SCORERS, async () => {
      const raw = await fetchTopScorers({ league, season });
      return { topScorers: normalizeTopScorers(raw?.response) };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/top-scorers] upstream error', err);
  }
}

/** Combines the fixture itself with events/lineups/statistics — four
 * upstream calls, so this is only ever hit for a single fixture the user
 * has opened, never for a list view. */
export async function getMatchDetail(fixtureId) {
  try {
    return await withCache(sportsMatchKey(fixtureId), CACHE_TTL.SPORTS_MATCH, async () => {
      const [fixtureRaw, eventsRaw, lineupsRaw, statisticsRaw] = await Promise.all([
        fetchFixtureById(fixtureId),
        fetchFixtureEvents(fixtureId),
        fetchFixtureLineups(fixtureId),
        fetchFixtureStatistics(fixtureId),
      ]);

      const fixture = normalizeFixture(fixtureRaw?.response?.[0]);
      return {
        fixture,
        events: normalizeEvents(eventsRaw?.response),
        lineups: normalizeLineups(lineupsRaw?.response),
        statistics: normalizeStatistics(statisticsRaw?.response),
      };
    });
  } catch (err) {
    return toSafeErrorResponse('[sports/match] upstream error', err);
  }
}
