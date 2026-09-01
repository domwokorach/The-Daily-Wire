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
import subscriptionsRouter from './api/subscriptions/index.js';
import webhooksRouter from './api/webhooks/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getEnv } from './config/env.js';
import { migrate } from './db/migrate.js';
import { startNewsletterScheduler } from './jobs/newsletterScheduler.js';

migrate();

const app = express();
const PORT = getEnv().port;

// `verify` stashes the exact raw bytes on the request before JSON-parsing —
// needed by the Resend webhook route to check the svix signature, which is
// computed over the raw body, not the parsed object.
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
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
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/webhooks', webhooksRouter);

startNewsletterScheduler();

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
