import { openWeatherRequest } from './openWeatherClient.js';
import { WEATHER_UNITS } from '../../config/weather.js';

const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export function fetchCurrentWeather({ latitude, longitude }) {
  return openWeatherRequest(CURRENT_WEATHER_URL, {
    lat: latitude,
    lon: longitude,
    units: WEATHER_UNITS,
  });
}
