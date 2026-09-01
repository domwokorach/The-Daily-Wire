import { createHash } from 'node:crypto';

// NewsAPI articles have no stable id — derive a deterministic one from the
// canonical URL (never from the title, which isn't guaranteed unique).
function createArticleId(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 16);
}

const INVALID_TITLES = new Set(['[removed]', 'removed']);

function isMalformedTitle(title) {
  const normalized = title.trim().toLowerCase();
  return normalized.length < 8 || INVALID_TITLES.has(normalized);
}

/**
 * Converts a raw NewsAPI article into this app's clean internal shape.
 * NewsAPI has no per-article category — `section` is supplied by the
 * caller from the request context (the category/section that was actually
 * queried), not derived from the article itself.
 *
 * Returns `null` if the article fails validation (missing title, missing
 * url, or a malformed/placeholder title — NewsAPI returns `"[Removed]"`
 * articles for takedowns instead of omitting them).
 */
export function normalizeArticle(raw, section) {
  const title = raw?.title?.trim();
  const url = raw?.url?.trim();

  if (!title || !url || isMalformedTitle(title)) return null;

  return {
    id: createArticleId(url),
    title,
    description: raw.description?.trim() || undefined,
    content: raw.content?.trim() || undefined,
    url,
    image: raw.urlToImage?.trim() || null,
    source: {
      id: raw.source?.id ?? null,
      name: raw.source?.name?.trim() || 'Unknown source',
    },
    author: raw.author?.trim() || undefined,
    publishedAt: raw.publishedAt || undefined,
    section: section ?? 'general',
  };
}

/** Normalizes a raw article list and drops invalid entries in one step. */
export function normalizeArticles(rawArticles, section) {
  return (rawArticles ?? []).map((raw) => normalizeArticle(raw, section)).filter((article) => article !== null);
}
