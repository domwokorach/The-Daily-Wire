export const CACHE_TTL = {
  // NewsAPI.org's Developer plan has a limited daily request quota — these
  // lean long on purpose, same rationale as the SPORTS_* values below.
  NEWS_HEADLINES: 15 * 60 * 1000,
  NEWS_SECTION: 15 * 60 * 1000,
  NEWS_SEARCH: 10 * 60 * 1000,
  NEWS_SOURCES: 6 * 60 * 60 * 1000,

  WEATHER_CURRENT: 10 * 60 * 1000,
  WEATHER_FORECAST: 15 * 60 * 1000,
  WEATHER_LOCATION: 6 * 60 * 60 * 1000,

  // API-Football's free plan caps at 100 requests/day — these lean long on
  // purpose. LIVE is the only short one, and only live fixtures poll it.
  SPORTS_LIVE: 30 * 1000,
  SPORTS_FIXTURES: 5 * 60 * 1000,
  SPORTS_RESULTS: 30 * 60 * 1000,
  SPORTS_STANDINGS: 60 * 60 * 1000,
  SPORTS_LEAGUES: 24 * 60 * 60 * 1000,
  SPORTS_TEAMS: 24 * 60 * 60 * 1000,
  SPORTS_TOP_SCORERS: 24 * 60 * 60 * 1000,
  SPORTS_MATCH: 30 * 1000,
};
