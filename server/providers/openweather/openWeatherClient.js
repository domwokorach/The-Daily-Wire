import { getEnv } from '../../config/env.js';
import { createOpenWeatherError } from './errors.js';

/**
 * Every OpenWeather request goes through here. Reads the credential fresh
 * from `getEnv()` on each call (never cached at import time), appends it as
 * `appid`, and never returns the constructed URL (which would contain the
 * key) to a caller outside this provider — routes and services only ever
 * see the parsed JSON body.
 */
export async function openWeatherRequest(url, parameters = {}) {
  const apiKey = getEnv().weatherApiKey;

  if (!apiKey) {
    throw new Error('WEATHER_API_KEY is not configured');
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  params.set('appid', apiKey);

  const requestUrl = `${url}?${params}`;

  let response;
  let data;
  try {
    response = await fetch(requestUrl, { signal: AbortSignal.timeout(10000) });
    data = await response.json().catch(() => null);
  } catch (err) {
    // Network failure / timeout / abort — never includes `requestUrl`.
    throw new Error(`OpenWeather request failed: ${err?.message ?? 'unknown error'}`);
  }

  if (!response.ok) {
    throw createOpenWeatherError(response.status, data);
  }

  return data;
}
