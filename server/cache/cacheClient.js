// Minimal in-memory TTL cache for upstream provider responses. Process-local
// — fine for a single server instance; swap for Redis/etc. if this ever
// runs as more than one process.

const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expires <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs) {
  store.set(key, { value, expires: Date.now() + ttlMs });
}
