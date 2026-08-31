import type { CategoryKey } from '@/data/categories';
import { APP_CONFIG } from '@/constants/config';

export type ArticleCategory = Exclude<CategoryKey, 'home' | 'weather'>;

export const NEWS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/news`;

/**
 * This platform is UK-only. `country=gb` (never `uk`) is enforced entirely
 * server-side — the frontend never sends a country and cannot override it.
 */
export const NEWS_CATEGORY_MAP: Partial<Record<ArticleCategory, string>> = {
  business: 'business',
  health: 'health',
  tech: 'technology',
  sport: 'sports',
};

/**
 * News API has no `politics`/`world` category — `general` combined with a
 * body-text `q` filter is too broad and too noisy (matches almost nothing
 * relevant in practice). These sections are served from a title-scoped
 * search on the `everything` endpoint instead, which the server further
 * restricts to approved UK publisher domains.
 */
// Kept short (3-4 OR terms, at most one quoted phrase) — News API's free
// tier gets noticeably less reliable on longer, more complex queries.
export const NEWS_CATEGORY_QUERY: Partial<Record<ArticleCategory, string>> = {
  politics: 'parliament OR Westminster OR government OR election',
  world: 'Europe OR Ukraine OR "Middle East" OR diplomacy',
};

export const NEWS_DEFAULTS = {
  cacheTtlMs: 10 * 60 * 1000,
  breakingWindowMs: 90 * 60 * 1000,
  breakingMax: 4,
} as const;
