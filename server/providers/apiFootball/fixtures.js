import { apiFootballRequest } from './apiFootballClient.js';

export function fetchLiveFixtures({ league }) {
  return apiFootballRequest('fixtures', { live: 'all', league });
}

/**
 * Recently completed fixtures. Deliberately a `status` + `from`/`to` date
 * range rather than API-Football's `last` param — `last` is a paid-plan-only
 * parameter (confirmed live: the free plan rejects it with "Free plans do
 * not have access to the Last parameter"), while `status`/`from`/`to` all
 * work on the free plan.
 */
export function fetchRecentFixtures({ league, season, from, to }) {
  return apiFootballRequest('fixtures', { league, season, status: 'FT-AET-PEN-AWD-WO', from, to });
}

/** Not-yet-started fixtures in a forward-looking date range — the
 * counterpart to `fetchRecentFixtures`. Same `status` + `from`/`to`
 * pattern, since it's confirmed free-plan compatible. */
export function fetchUpcomingFixtures({ league, season, from, to }) {
  return apiFootballRequest('fixtures', { league, season, status: 'NS-TBD', from, to });
}

export function fetchFixtureById(fixtureId) {
  return apiFootballRequest('fixtures', { id: fixtureId });
}

export function fetchFixtureEvents(fixtureId) {
  return apiFootballRequest('fixtures/events', { fixture: fixtureId });
}

export function fetchFixtureLineups(fixtureId) {
  return apiFootballRequest('fixtures/lineups', { fixture: fixtureId });
}

export function fetchFixtureStatistics(fixtureId) {
  return apiFootballRequest('fixtures/statistics', { fixture: fixtureId });
}
