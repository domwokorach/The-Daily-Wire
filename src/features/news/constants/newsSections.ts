import type { ArticleCategory } from '@/data/categories';

/**
 * This platform is UK-only. `country=gb` (never `uk`) is enforced entirely
 * server-side — the frontend never sends a country and cannot override it.
 *
 * Covers the sections that map to a real NewsAPI.org `top-headlines`
 * category (`/api/news`). `politics`/`world` are served via
 * `useSectionNews` (`/api/news/everything?section=`) instead — NewsAPI.org
 * has no native category for either, so those two are served via an
 * editorial UK-focused search query instead of a category param.
 */
export const NEWS_CATEGORY_MAP: Partial<Record<ArticleCategory, string>> = {
  business: 'business',
  health: 'health',
  tech: 'technology',
  sport: 'sports',
};
