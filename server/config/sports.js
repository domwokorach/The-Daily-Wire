// Central place for provider-specific league/season identifiers — never
// hard-code API-Football's numeric league IDs in routes or components.
export const SPORTS_LEAGUES = {
  premierLeague: {
    id: 39,
    name: 'Premier League',
    country: 'England',
  },
};

export const DEFAULT_LEAGUE_ID = SPORTS_LEAGUES.premierLeague.id;

/**
 * API-Football seasons are the year the season *starts* (e.g. the 2023/24
 * season is `2023`), not the current calendar year.
 *
 * The free plan does not grant access to every season — confirmed live,
 * this key's plan only serves 2022–2024 (a live `season=2026` request
 * comes back `Free plans do not have access to this season, try from 2022
 * to 2024`). `2023` is the newest season this plan is guaranteed to serve,
 * so it's the default rather than the true current season. Update this
 * once the API key is upgraded to a plan with current-season access.
 */
export const CURRENT_FOOTBALL_SEASON = 2023;
