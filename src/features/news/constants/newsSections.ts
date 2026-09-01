import type { ArticleCategory } from '@/data/categories';

/**
 * This platform is UK-only. `country=gb` (never `uk`) is enforced entirely
 * server-side — the frontend never sends a country and cannot override it.
 *
 * Covers the sections that map to a real News-headlines category
 * (`/api/news`). `politics`/`world` are served via `useSectionNews`
 * (`/api/news/everything?section=`) instead — NewsData.io supports them as
 * native categories too, just through the search endpoint rather than the
 * headlines one.
 */
export const NEWS_CATEGORY_MAP: Partial<Record<ArticleCategory, string>> = {
  business: 'business',
  health: 'health',
  tech: 'technology',
  sport: 'sports',
};
