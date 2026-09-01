import { NEWS_API_BASE_URL } from '../../config/news.js';
import { getEnv } from '../../config/env.js';

/**
 * Authenticates via the `X-Api-Key` header, never a query-string param —
 * the key must never end up in a URL that could be captured by logs,
 * analytics, or error reports.
 */
export async function newsApiRequest(endpoint, params = {}) {
  const apiKey = getEnv().newsApiKey;

  if (!apiKey) {
    const error = new Error('NEWS_API_KEY is not configured');
    error.code = 'NEWS_CONFIGURATION_ERROR';
    throw error;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') searchParams.set(key, value);
  }

  const response = await fetch(`${NEWS_API_BASE_URL}/${endpoint}?${searchParams}`, {
    headers: { 'X-Api-Key': apiKey },
    signal: AbortSignal.timeout(10000),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'NEWS_PROVIDER_ERROR');
    error.status = response.status;
    error.code = data?.code || 'unexpectedError';
    throw error;
  }

  return data;
}
