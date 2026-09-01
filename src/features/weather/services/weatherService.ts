import { cachedGet, type QueryParams } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { CurrentWeather, Forecast, WeatherLocation } from '../types';

const WEATHER_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/weather`;

const WEATHER_DEFAULTS = {
  cacheTtlMs: 10 * 60 * 1000,
} as const;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

function coordParams({ latitude, longitude }: Coordinates): QueryParams {
  return { lat: latitude, lon: longitude };
}

// Talks only to this app's own `/api/weather/*` routes — never to
// OpenWeather directly, and never sees an API key.
export function getCurrentWeather(coords: Coordinates): Promise<CurrentWeather> {
  return cachedGet<CurrentWeather>(`${WEATHER_ENDPOINT}/current`, coordParams(coords), WEATHER_DEFAULTS.cacheTtlMs);
}

export function getForecast(coords: Coordinates): Promise<Forecast> {
  return cachedGet<Forecast>(`${WEATHER_ENDPOINT}/forecast`, coordParams(coords), WEATHER_DEFAULTS.cacheTtlMs);
}

export function searchLocations(query: string): Promise<WeatherLocation[]> {
  if (!query.trim()) return Promise.resolve([]);
  return cachedGet<{ results: WeatherLocation[] }>(`${WEATHER_ENDPOINT}/search`, { q: query }).then(
    (result) => result.results,
  );
}
