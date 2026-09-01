// Single place server code reads `process.env` from. Read at call time
// (not cached at import time) so it always reflects the environment the
// process was actually started with.
export function getEnv() {
  return {
    newsDataApiKey: process.env.NEWSDATA_API_KEY || '',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    sportsApiKey: process.env.SPORTS_API_KEY || '',
    sportsApiBaseUrl: process.env.SPORTS_API_BASE_URL || '',
    sportsApiHost: process.env.SPORTS_API_HOST || '',
    port: Number(process.env.PORT) || 8787,
    isProduction: process.env.NODE_ENV === 'production',
  };
}
