import { subscribeToBreakingNews } from '../../services/notificationService.js';
import { getPreferences } from '../../repositories/notificationPrefRepository.js';

export default function breakingStream(req, res) {
  const categories = req.user ? getPreferences(req.user.id).categoriesCsv.split(',').filter(Boolean) : [];

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
