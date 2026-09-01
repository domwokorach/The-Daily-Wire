const NEWSDATA_BASE = 'https://newsdata.io/api/1/latest';

/**
 * NewsData.io authenticates via an `apikey` *query parameter*, not a
 * header — unlike NewsAPI. That means the key lives in the request URL, so
 * every log line here must describe the request by its param names only,
 * never the full URL/query string (which would include the key value).
 */
export async function fetchLatest(params, apiKey) {
  const url = new URL(NEWSDATA_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  }
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}
