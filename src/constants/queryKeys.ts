import type { ArticleCategory } from '@/data/categories';

/** Centralised TanStack Query key factory for News — keeps cache
 * invalidation and staleness predictable as query params grow. */
export const newsKeys = {
  all: ['news'] as const,
  headlines: (category?: ArticleCategory) => ['news', 'headlines', category ?? 'home'] as const,
  breaking: () => ['news', 'breaking'] as const,
  section: (section: ArticleCategory) => ['news', 'section', section] as const,
  everything: (query: string | undefined, options?: unknown) =>
    ['news', 'everything', query, options] as const,
  search: (query: string) => ['news', 'search', query] as const,
};

/** Centralised TanStack Query key factory for Weather. Coordinates are
 * rounded to keep near-identical geolocation reads on one cache entry. */
export const weatherKeys = {
  all: ['weather'] as const,
  current: (latitude: number, longitude: number) =>
    ['weather', 'current', latitude.toFixed(4), longitude.toFixed(4)] as const,
  forecast: (latitude: number, longitude: number) =>
    ['weather', 'forecast', latitude.toFixed(4), longitude.toFixed(4)] as const,
  search: (query: string) => ['weather', 'search', query] as const,
};

/** Centralised TanStack Query key factory for Sport (API-Football). */
export const sportsKeys = {
  all: ['sports'] as const,
  live: () => ['sports', 'live'] as const,
  fixtures: (days: number) => ['sports', 'fixtures', days] as const,
  results: (days: number) => ['sports', 'results', days] as const,
  standings: () => ['sports', 'standings'] as const,
  topScorers: () => ['sports', 'top-scorers'] as const,
  match: (id: number) => ['sports', 'match', id] as const,
};

/** Centralised TanStack Query key factory for auth/account. */
export const authKeys = {
  all: ['auth'] as const,
  me: () => ['auth', 'me'] as const,
};

/** Centralised TanStack Query key factory for article comments. */
export const commentKeys = {
  all: ['comments'] as const,
  byArticle: (articleId: string, sort: 'newest' | 'oldest' = 'newest') =>
    ['comments', 'article', articleId, sort] as const,
};

/** Centralised TanStack Query key factory for notification preferences. */
export const notificationKeys = {
  all: ['notifications'] as const,
  preferences: () => ['notifications', 'preferences'] as const,
};

/** Centralised TanStack Query key factory for newsletter subscriptions. */
export const subscriptionKeys = {
  all: ['subscription'] as const,
  me: () => ['subscription', 'me'] as const,
  managed: (token: string) => ['subscription', 'managed', token] as const,
};

/** Centralised TanStack Query key factory for saved articles. */
export const savedArticleKeys = {
  all: ['savedArticles'] as const,
  list: () => ['savedArticles', 'list'] as const,
  check: (articleId: string) => ['savedArticles', 'check', articleId] as const,
};
