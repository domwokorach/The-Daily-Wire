import { subscribeToArticle } from '../../realtime/channels.js';
import { parseArticleIdParam } from '../../validators/commentValidator.js';

/** Public SSE stream, one connection per open article page — subscribes
 * only to that article's channel (`realtime/channels.js`), never a global
 * firehose. Mirrors `api/notifications/breakingStream.js`'s shape. Reads
 * are intentionally open to anyone (see `realtime/auth.js`); this route
 * never authorizes a mutation, it only forwards what the REST comment
 * endpoints already broadcast. */
export default function commentStream(req, res) {
  const parsed = parseArticleIdParam(req.params.articleId);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: true, code: parsed.code, message: parsed.message });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('retry: 3000\n\n');

  const unsubscribe = subscribeToArticle(parsed.articleId, (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
