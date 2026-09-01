import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import newsRouter from './api/news/index.js';
import weatherRouter from './api/weather/index.js';
import sportsRouter from './api/sports/index.js';
import authRouter from './api/auth/index.js';
import { articleCommentsRouter, commentByIdRouter } from './api/comments/index.js';
import notificationsRouter from './api/notifications/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getEnv } from './config/env.js';
import { migrate } from './db/migrate.js';

migrate();

const app = express();
const PORT = getEnv().port;

app.use(express.json());
app.use(cookieParser());
if (!getEnv().isProduction) {
  app.use(cors({ origin: getEnv().corsOrigin, credentials: true }));
}

app.use('/api/news', newsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/sports', sportsRouter);
app.use('/api/auth', authRouter);
app.use('/api/articles', articleCommentsRouter);
app.use('/api/comments', commentByIdRouter);
app.use('/api/notifications', notificationsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
  if (!getEnv().isProduction) {
    // Never logs the key itself — only whether one was picked up from .env.
    console.log('NewsData.io configured:', Boolean(getEnv().newsDataApiKey));
    console.log('OpenWeather configured:', Boolean(getEnv().weatherApiKey));
    console.log('API-Football configured:', Boolean(getEnv().sportsApiKey));
  }
});
