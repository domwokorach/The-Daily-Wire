// Minimal in-memory TTL cache for upstream provider responses. Process-local
// — fine for a single server instance; swap for Redis/etc. if this ever
// runs as more than one process.
//
// Expired entries are kept around (not deleted) rather than evicted, so
// `cacheGetStale` can still serve them as a last-known-good fallback when
// the upstream provider is down or rate-limited — see `cacheGetStale`.

const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expires <= Date.now()) return undefined;
  return entry.value;
}

/** Returns the cached value even if its TTL has expired, as long as it was
 * stored within `maxAgeMs`. Used as a fallback when a fresh upstream
 * request fails — stale data beats a blank/broken page. */
export function cacheGetStale(key, maxAgeMs) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.storedAt > maxAgeMs) return undefined;
  return entry.value;
}

export function cacheSet(key, value, ttlMs) {
  store.set(key, { value, expires: Date.now() + ttlMs, storedAt: Date.now() });
}
