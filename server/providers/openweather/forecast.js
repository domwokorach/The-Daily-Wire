import { openWeatherRequest } from './openWeatherClient.js';
import { WEATHER_UNITS } from '../../config/weather.js';

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/** Standard 5-day/3-hour forecast — free-tier compatible (no One Call
 * subscription required). See `oneCall.js` (not yet wired in) for an
 * optional richer upgrade path that keeps the same normalized shape. */
export function fetchForecast({ latitude, longitude }) {
  return openWeatherRequest(FORECAST_URL, {
    lat: latitude,
    lon: longitude,
    units: WEATHER_UNITS,
  });
}
