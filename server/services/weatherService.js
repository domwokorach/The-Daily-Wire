import { fetchCurrentWeather } from '../providers/openweather/currentWeather.js';
import { fetchForecast } from '../providers/openweather/forecast.js';
import { fetchGeocoding } from '../providers/openweather/geocoding.js';
import { normalizeCurrentWeather } from '../providers/openweather/normalizeWeather.js';
import { normalizeForecast } from '../providers/openweather/normalizeForecast.js';
import { normalizeLocations } from '../providers/openweather/normalizeLocation.js';
import { OpenWeatherError, getSafeWeatherErrorMessage, getSafeWeatherErrorStatus } from '../providers/openweather/errors.js';
import { cacheGet, cacheSet } from '../cache/cacheClient.js';
import { weatherCurrentKey, weatherForecastKey, weatherSearchKey } from '../cache/cacheKeys.js';
import { CACHE_TTL } from '../cache/ttl.js';
import { getEnv } from '../config/env.js';

function toSafeErrorResponse(logLabel, err) {
  if (err instanceof OpenWeatherError) {
    console.error(logLabel, err.upstreamStatus, err.code, err.message);
    return {
      status: getSafeWeatherErrorStatus(err.code),
      body: {
        error: true,
        code: err.code,
        message: getSafeWeatherErrorMessage(err.code),
        ...(getEnv().isProduction ? {} : { provider: 'openweather', upstreamStatus: err.upstreamStatus }),
      },
    };
  }

  console.error(logLabel, err);
  return {
    status: 502,
    body: {
      error: true,
      code: 'WEATHER_SERVICE_ERROR',
      message: 'Unable to load weather data right now.',
      ...(getEnv().isProduction ? {} : { devMessage: err?.message }),
    },
  };
}

export async function getCurrentWeather({ latitude, longitude }) {
  const cacheKey = weatherCurrentKey({ latitude, longitude });
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  try {
    const raw = await fetchCurrentWeather({ latitude, longitude });
    const body = normalizeCurrentWeather(raw, { latitude, longitude });
    cacheSet(cacheKey, body, CACHE_TTL.WEATHER_CURRENT);
    return { status: 200, body };
  } catch (err) {
    return toSafeErrorResponse('[weather/current] upstream error', err);
  }
}

export async function getForecast({ latitude, longitude }) {
  const cacheKey = weatherForecastKey({ latitude, longitude });
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  try {
    const raw = await fetchForecast({ latitude, longitude });
    const body = normalizeForecast(raw);
    cacheSet(cacheKey, body, CACHE_TTL.WEATHER_FORECAST);
    return { status: 200, body };
  } catch (err) {
    return toSafeErrorResponse('[weather/forecast] upstream error', err);
  }
}

export async function searchLocations(query) {
  const cacheKey = weatherSearchKey(query);
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  try {
    const raw = await fetchGeocoding(query);
    const body = { results: normalizeLocations(raw) };
    cacheSet(cacheKey, body, CACHE_TTL.WEATHER_LOCATION);
    return { status: 200, body };
  } catch (err) {
    return toSafeErrorResponse('[weather/search] upstream error', err);
  }
}
