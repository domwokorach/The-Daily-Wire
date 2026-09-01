/** Converts a raw NewsAPI source into this app's clean internal shape. */
export function normalizeSource(raw) {
  return {
    id: raw?.id,
    name: raw?.name?.trim() || raw?.id,
    description: raw?.description?.trim() || undefined,
    url: raw?.url || undefined,
    category: raw?.category || undefined,
    language: raw?.language || undefined,
    country: raw?.country || undefined,
  };
}

export function normalizeSources(rawSources) {
  return (rawSources ?? []).map(normalizeSource);
}
