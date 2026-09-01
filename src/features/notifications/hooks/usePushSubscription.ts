import { useState } from 'react';
import { subscribePush, unsubscribePush } from '@/features/account/services/notificationPrefsService';

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0))).buffer;
}

/** Requests browser push permission and subscribes — must only be invoked
 * from an explicit user action in Settings, never on page load. */
export function usePushSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enable = async (vapidPublicKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        throw new Error('Push notifications are not supported in this browser.');
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission was not granted.');
      }
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      await subscribePush(subscription.toJSON());
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable push notifications.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disable = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration('/service-worker.js');
      const subscription = await registration?.pushManager.getSubscription();
      await subscription?.unsubscribe();
      await unsubscribePush();
    } finally {
      setIsLoading(false);
    }
  };

  return { enable, disable, isLoading, error };
}
