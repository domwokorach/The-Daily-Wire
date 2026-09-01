import type { SubscriptionPreferenceKey } from './constants/subscriptionTypes';

export type SubscriptionPreferences = Record<SubscriptionPreferenceKey, boolean>;

export type SubscriptionStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced' | 'complained';

export interface Subscription {
  id: string;
  email: string;
  status: SubscriptionStatus;
  preferences: SubscriptionPreferences;
  emailVerified: boolean;
  subscribedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
}

export interface SubscribePayload {
  email: string;
  preferences?: Partial<SubscriptionPreferences>;
  /** Honeypot field — always left empty by real users. */
  website?: string;
}

export interface SubscribeResult {
  message: string;
  pending?: boolean;
  alreadySubscribed?: boolean;
  subscription: Subscription;
}
