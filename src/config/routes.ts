export const ROUTES = {
  HOME: '/',
  POLITICS: '/politics',
  WORLD: '/world',
  BUSINESS: '/business',
  HEALTH: '/health',
  TECH: '/tech',
  SPORT: '/sport',
  MATCH: '/sport/match/:id',
  WEATHER: '/weather',
  SEARCH: '/search',
  ARTICLE: '/article/:slug',
  NOT_FOUND: '*',
} as const;

export function buildArticlePath(slug: string): string {
  return `/article/${slug}`;
}

export function buildMatchPath(id: number | string): string {
  return `/sport/match/${id}`;
}

export function buildSearchPath(query?: string): string {
  return query ? `/search?q=${encodeURIComponent(query)}` : '/search';
}
