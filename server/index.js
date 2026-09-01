import 'dotenv/config';
import { buildApp } from './app.js';
import { getEnv } from './config/env.js';

const app = await buildApp();
const PORT = getEnv().port;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
  if (!getEnv().isProduction) {
    // Never logs the key itself — only whether one was picked up from .env.
    console.log('NewsAPI.org configured:', Boolean(getEnv().newsApiKey));
    console.log('OpenWeather configured:', Boolean(getEnv().weatherApiKey));
    console.log('API-Football configured:', Boolean(getEnv().sportsApiKey));
  }
});
