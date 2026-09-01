import { openWeatherRequest } from './openWeatherClient.js';

const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const RESULT_LIMIT = 5;

/** `query` is expected to already be UK-biased (e.g. `Manchester,GB`) by
 * the caller — this just forwards it. */
export function fetchGeocoding(query) {
  return openWeatherRequest(GEOCODING_URL, {
    q: query,
    limit: RESULT_LIMIT,
  });
}
