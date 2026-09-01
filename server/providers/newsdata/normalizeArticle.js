// Converts a raw NewsData.io article into this app's clean internal shape.
// NewsData's field names differ substantially from News API's (link vs
// url, pubDate vs publishedAt, creator[] vs author, category[] vs a single
// requested category) — this is the only place that shape difference is
// known about.

function hashUrl(url) {
  let value = 0;
  for (let i = 0; i < url.length; i += 1) {
    value = (value << 5) - value + url.charCodeAt(i);
    value |= 0;
  }
  return Math.abs(value).toString(36);
}

const INVALID_TITLES = new Set(['[removed]', 'removed']);

function isMalformedTitle(title) {
  const normalized = title.trim().toLowerCase();
  return normalized.length < 8 || INVALID_TITLES.has(normalized);
}

const APP_SECTIONS = new Set(['politics', 'world', 'business', 'health', 'tech', 'sport']);
const NEWSDATA_CATEGORY_TO_APP_SECTION = {
  politics: 'politics',
  world: 'world',
  business: 'business',
  health: 'health',
  technology: 'tech',
  sports: 'sport',
};

/** NewsData's own `category` array, trusted directly (per the "drop the
 * classifier" decision) — any category outside our six app sections (e.g.
 * "top", "lifestyle", "other") becomes `general`. */
function resolveSection(categories) {
  for (const category of categories ?? []) {
    const section = NEWSDATA_CATEGORY_TO_APP_SECTION[category];
    if (section && APP_SECTIONS.has(section)) return section;
  }
  return 'general';
}

/** Returns the clean article shape, or `null` if it fails validation
 * (missing title, missing link, malformed/placeholder title). */
export function normalizeArticle(raw) {
  const title = raw?.title?.trim();
  const url = raw?.link?.trim();

  if (!title || !url || isMalformedTitle(title)) return null;

  return {
    id: raw?.article_id || hashUrl(url),
    title,
    description: raw.description?.trim() || undefined,
    content: raw.content?.trim() || undefined,
    url,
    image: raw.image_url?.trim() || null,
    source: {
      id: raw.source_id ?? null,
      name: raw.source_name?.trim() || raw.source_id || 'Unknown source',
    },
    author: Array.isArray(raw.creator) ? raw.creator[0]?.trim() || undefined : undefined,
    publishedAt: raw.pubDate ? new Date(raw.pubDate.replace(' ', 'T') + 'Z').toISOString() : undefined,
    section: resolveSection(raw.category),
  };
}

/** Normalizes a raw article list and drops invalid entries in one step. */
export function normalizeArticles(rawArticles) {
  return rawArticles.map(normalizeArticle).filter((article) => article !== null);
}
