import { cachedGet } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { Fixture, StandingRow, TopScorerRow, MatchDetail } from '../types';

const SPORTS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/sports`;

const SPORTS_DEFAULTS = {
  cacheTtlMs: 60 * 1000,
} as const;

// Talks only to this app's own `/api/sports/*` routes — never to
// API-Football directly, and never sees an API key. League/season default
// server-side to the Premier League (see `server/config/sports.js`), so
// the frontend doesn't need to know API-Football's numeric league IDs.
export function getLiveMatches(): Promise<{ fixtures: Fixture[] }> {
  return cachedGet<{ fixtures: Fixture[] }>(`${SPORTS_ENDPOINT}/live`, {}, SPORTS_DEFAULTS.cacheTtlMs);
}

/** Upcoming, not-yet-started fixtures only — never mixes in past results.
 * `days` is a forward-looking window (default 14 server-side), never a
 * specific calendar date. */
export function getFixtures(days = 14): Promise<{ fixtures: Fixture[] }> {
  return cachedGet<{ fixtures: Fixture[] }>(`${SPORTS_ENDPOINT}/fixtures`, { days }, 10 * 60 * 1000);
}

/** Recently completed fixtures only — never mixes in upcoming fixtures. */
export function getRecentResults(days = 14): Promise<{ fixtures: Fixture[] }> {
  return cachedGet<{ fixtures: Fixture[] }>(`${SPORTS_ENDPOINT}/results`, { days }, 30 * 60 * 1000);
}

export function getStandings(): Promise<{ standings: StandingRow[] }> {
  return cachedGet<{ standings: StandingRow[] }>(`${SPORTS_ENDPOINT}/standings`, {}, 60 * 60 * 1000);
}

export function getTopScorers(): Promise<{ topScorers: TopScorerRow[] }> {
  return cachedGet<{ topScorers: TopScorerRow[] }>(`${SPORTS_ENDPOINT}/top-scorers`, {}, 60 * 60 * 1000);
}

export function getMatchDetail(id: number): Promise<MatchDetail> {
  return cachedGet<MatchDetail>(`${SPORTS_ENDPOINT}/match/${id}`, {}, 30 * 1000);
}
