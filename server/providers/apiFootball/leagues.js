import { apiFootballRequest } from './apiFootballClient.js';

/** For setup/discovery use only — not called on every page load (see
 * `server/api/sports/leagues.js`, gated to non-production). */
export function fetchLeagues({ country, current }) {
  return apiFootballRequest('leagues', { country, current });
}
