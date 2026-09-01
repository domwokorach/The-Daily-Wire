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
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SAVED: '/saved',
  SUBSCRIBE: '/subscribe',
  SUBSCRIPTION_CONFIRM: '/subscription/confirm',
  SUBSCRIPTION_MANAGE: '/subscription/manage',
  SUBSCRIPTION_UNSUBSCRIBE: '/subscription/unsubscribe',
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
