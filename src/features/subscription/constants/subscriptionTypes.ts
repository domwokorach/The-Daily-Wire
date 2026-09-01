export const SUBSCRIPTION_TYPES = {
  DAILY_DIGEST: 'dailyDigest',
  WEEKLY_DIGEST: 'weeklyDigest',
  BREAKING_NEWS: 'breakingNews',
  POLITICS: 'politics',
  WORLD: 'world',
  BUSINESS: 'business',
  HEALTH: 'health',
  TECH: 'tech',
  SPORT: 'sport',
} as const;

export type SubscriptionPreferenceKey = (typeof SUBSCRIPTION_TYPES)[keyof typeof SUBSCRIPTION_TYPES];

export interface SubscriptionPreferenceOption {
  key: SubscriptionPreferenceKey;
  label: string;
  group: 'delivery' | 'topic';
}

/** Kept aligned with the app's internal section names (`@/data/categories`)
 * — `tech`/`sport`/etc match `ArticleCategory`, not display labels. */
export const SUBSCRIPTION_PREFERENCE_OPTIONS: SubscriptionPreferenceOption[] = [
  { key: SUBSCRIPTION_TYPES.DAILY_DIGEST, label: 'Daily News', group: 'delivery' },
  { key: SUBSCRIPTION_TYPES.WEEKLY_DIGEST, label: 'Weekly Digest', group: 'delivery' },
  { key: SUBSCRIPTION_TYPES.BREAKING_NEWS, label: 'Breaking News', group: 'delivery' },
  { key: SUBSCRIPTION_TYPES.POLITICS, label: 'Politics', group: 'topic' },
  { key: SUBSCRIPTION_TYPES.WORLD, label: 'World', group: 'topic' },
  { key: SUBSCRIPTION_TYPES.BUSINESS, label: 'Business', group: 'topic' },
  { key: SUBSCRIPTION_TYPES.HEALTH, label: 'Health', group: 'topic' },
  { key: SUBSCRIPTION_TYPES.TECH, label: 'Technology', group: 'topic' },
  { key: SUBSCRIPTION_TYPES.SPORT, label: 'Sport', group: 'topic' },
];
