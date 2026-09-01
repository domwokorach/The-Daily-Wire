import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { CategoryKey } from '@/data/categories';

const NOTIFICATIONS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/notifications`;

export interface NotificationPreferences {
  categories: CategoryKey[];
  pushEnabled: boolean;
}

export function getPreferences(): Promise<NotificationPreferences> {
  return apiClient.get(`${NOTIFICATIONS_ENDPOINT}/preferences`);
}

export function updatePreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
  return apiClient.put(`${NOTIFICATIONS_ENDPOINT}/preferences`, prefs);
}

export function subscribePush(subscription: PushSubscriptionJSON): Promise<{ subscribed: boolean }> {
  return apiClient.post(`${NOTIFICATIONS_ENDPOINT}/push/subscribe`, { subscription });
}

export function unsubscribePush(): Promise<{ subscribed: boolean }> {
  return apiClient.delete(`${NOTIFICATIONS_ENDPOINT}/push/subscribe`);
}
