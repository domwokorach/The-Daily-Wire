import { subscribeToBreakingNews } from '../../services/notificationService.js';
import { getPreferences } from '../../repositories/notificationPrefRepository.js';

export default async function breakingStream(req, res) {
  let categories = [];
  try {
    if (req.user) {
      const prefs = await getPreferences(req.user.id);
      categories = prefs.categoriesCsv.split(',').filter(Boolean);
    }
  } catch (err) {
    console.error('[breakingStream] failed to load preferences', err);
    if (!res.headersSent) {
      res.status(500).json({ error: true, code: 'INTERNAL_ERROR' });
    } else {
      res.end();
    }
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('retry: 5000\n\n');

  const unsubscribe = subscribeToBreakingNews((alert) => {
    if (categories.length && !categories.includes(alert.category)) return;
    res.write(`data: ${JSON.stringify(alert)}\n\n`);
  });

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
