// Cache keys are derived from the *validated* request params (never from the
// raw upstream query string, and never including the API key) — one stable
// key per distinct client request.
function serialize(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
    .join('&');
}

export function newsHeadlinesKey(params) {
  return `news:headlines:${serialize(params)}`;
}

export function newsEverythingKey(params) {
  return `news:everything:${serialize(params)}`;
}

export function newsSourcesKey(params) {
  return `news:sources:${serialize(params)}`;
}

// Coordinates are rounded before keying so that requests within ~1m of each
// other (e.g. repeated geolocation reads) share one cache entry instead of
// fragmenting the cache with near-duplicate keys.
function roundCoord(value) {
  return Number(value).toFixed(4);
}

export function weatherCurrentKey({ latitude, longitude }) {
  return `weather:current:${roundCoord(latitude)}:${roundCoord(longitude)}`;
}

export function weatherForecastKey({ latitude, longitude }) {
  return `weather:forecast:${roundCoord(latitude)}:${roundCoord(longitude)}`;
}

export function weatherSearchKey(query) {
  return `weather:search:${query.trim().toLowerCase()}`;
}

export function sportsLiveKey({ league }) {
  return `sports:live:${league}`;
}

export function sportsFixturesKey(params) {
  return `sports:fixtures:${serialize(params)}`;
}

export function sportsResultsKey(params) {
  return `sports:results:${serialize(params)}`;
}

export function sportsStandingsKey({ league, season }) {
  return `sports:standings:${league}:${season}`;
}

export function sportsTeamsKey({ league, season }) {
  return `sports:teams:${league}:${season}`;
}

export function sportsTopScorersKey({ league, season }) {
  return `sports:topscorers:${league}:${season}`;
}

export function sportsMatchKey(fixtureId) {
  return `sports:match:${fixtureId}`;
}
