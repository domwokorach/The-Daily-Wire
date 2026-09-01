import { getEnv } from '../../config/env.js';
import { createApiFootballError, extractApiFootballErrors } from './errors.js';

/**
 * Every API-Football request goes through here. Reads the credential fresh
 * from `getEnv()` (never cached at import time), sends it as the
 * `x-apisports-key` header (never a query param, so it can't leak into a
 * logged URL), and never logs the key.
 */
export async function apiFootballRequest(endpoint, params = {}) {
  const { sportsApiKey: apiKey, sportsApiBaseUrl: baseUrl } = getEnv();

  if (!apiKey) {
    throw new Error('SPORTS_API_KEY is not configured');
  }
  if (!baseUrl) {
    throw new Error('SPORTS_API_BASE_URL is not configured');
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') searchParams.set(key, String(value));
  }

  let response;
  let data;
  try {
    response = await fetch(`${baseUrl}/${endpoint}?${searchParams}`, {
      headers: { 'x-apisports-key': apiKey },
      signal: AbortSignal.timeout(10000),
    });
    data = await response.json().catch(() => null);
  } catch (err) {
    throw new Error(`API-Football request failed: ${err?.message ?? 'unknown error'}`);
  }

  if (!response.ok || extractApiFootballErrors(data).length > 0) {
    throw createApiFootballError(response.status, data);
  }

  return data;
}
