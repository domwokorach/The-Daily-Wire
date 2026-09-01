import { EventEmitter } from 'node:events';

// One `EventEmitter` per article id, created lazily and dropped once its
// last subscriber disconnects — mirrors `notificationService.js`'s
// single-process pub/sub, scoped per-article instead of global so a
// comment on one article never reaches readers of another
// (`article:{articleId}` channel semantics without a real message broker).
// Same single-instance limitation as the rest of this app's in-memory
// state: fan-out across multiple server processes would need a shared
// broker (Redis pub/sub, etc.) instead of this Map.
const channels = new Map();

function getChannel(articleId) {
  let channel = channels.get(articleId);
  if (!channel) {
    channel = new EventEmitter();
    channel.setMaxListeners(0);
    channels.set(articleId, channel);
  }
  return channel;
}

export function subscribeToArticle(articleId, listener) {
  const channel = getChannel(articleId);
  channel.on('event', listener);
  return () => {
    channel.off('event', listener);
    if (channel.listenerCount('event') === 0) channels.delete(articleId);
  };
}

export function publishToArticle(articleId, event) {
  const channel = channels.get(articleId);
  if (!channel) return;
  channel.emit('event', event);
}
