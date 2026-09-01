import { getCategoryByKey } from '@/data/categories';
import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/data/categories';
import { FALLBACK_IMAGE } from '@/constants/fallbackImage';

/**
 * The server's already-normalized article shape (see
 * `server/services/newsService.js`'s pipeline) — never a raw provider
 * response. `section` is NewsData.io's own category tagging, passed
 * through directly (trusted as-is, no client-side classification).
 */
export interface ServerArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  image: string | null;
  source: { id: string | null; name: string };
  author?: string;
  publishedAt?: string;
  section: ArticleCategory | 'general';
}

function toValidTimestamp(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Adapts the server's classified article into this app's presentation
 * model — renames fields, applies the UI fallback image (a presentational
 * concern that stays client-side), and turns the server's `general` section
 * into "no category" for cross-category feeds. */
export function normalizeArticle(raw: ServerArticle): Article | undefined {
  if (!raw?.title || !raw?.url) return undefined;

  const category = raw.section === 'general' ? undefined : raw.section;
  const author = raw.author?.trim();
  const sourceName = raw.source?.name?.trim() || undefined;

  return {
    id: raw.id,
    category,
    categoryLabel: category ? getCategoryByKey(category)?.label : undefined,
    headline: raw.title,
    summary: raw.description || undefined,
    image: raw.image || FALLBACK_IMAGE,
    timestamp: toValidTimestamp(raw.publishedAt),
    author: author && author !== sourceName ? author : undefined,
    url: raw.url,
    sourceName,
  };
}
