import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { Subscription, SubscribePayload, SubscribeResult, SubscriptionPreferences } from '../types';

const SUBSCRIPTIONS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/subscriptions`;

export function subscribe(payload: SubscribePayload): Promise<SubscribeResult> {
  return apiClient.post<SubscribeResult>(SUBSCRIPTIONS_ENDPOINT, payload);
}

export function confirmSubscription(token: string): Promise<{ confirmed: boolean; subscription: Subscription }> {
  return apiClient.post(`${SUBSCRIPTIONS_ENDPOINT}/confirm`, { token });
}

export function resendConfirmation(email: string): Promise<{ message: string }> {
  return apiClient.post(`${SUBSCRIPTIONS_ENDPOINT}/resend-confirmation`, { email });
}

interface PreferencesEnvelope {
  subscribed: boolean;
  subscription: Subscription | null;
}

export function getMyPreferences(): Promise<PreferencesEnvelope> {
  return apiClient.get(`${SUBSCRIPTIONS_ENDPOINT}/preferences`);
}

export function updateMyPreferences(preferences: Partial<SubscriptionPreferences>): Promise<{ subscription: Subscription }> {
  return apiClient.patch(`${SUBSCRIPTIONS_ENDPOINT}/preferences`, { preferences });
}

export function getManagedSubscription(token: string): Promise<{ subscription: Subscription }> {
  return apiClient.get(`${SUBSCRIPTIONS_ENDPOINT}/manage?token=${encodeURIComponent(token)}`);
}

export function updateManagedSubscription(
  token: string,
  preferences: Partial<SubscriptionPreferences>,
): Promise<{ subscription: Subscription }> {
  return apiClient.patch(`${SUBSCRIPTIONS_ENDPOINT}/manage`, { token, preferences });
}

export function unsubscribe(token: string, categories?: string[]): Promise<{ message: string; subscription: Subscription }> {
  return apiClient.post(`${SUBSCRIPTIONS_ENDPOINT}/unsubscribe`, { token, categories });
}

export function resubscribe(token: string): Promise<{ message: string; subscription: Subscription }> {
  return apiClient.post(`${SUBSCRIPTIONS_ENDPOINT}/resubscribe`, { token });
}
