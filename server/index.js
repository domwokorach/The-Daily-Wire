import 'dotenv/config';
import express from 'express';
import newsRouter from './api/news.js';

const app = express();
const PORT = Number(process.env.PORT) || 8787;

app.use('/api/news', newsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
