self.addEventListener('push', (event) => {
  if (!event.data) return;
  const { title, url } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title || 'Breaking news', {
      body: 'Tap to read the full story.',
      data: { url },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
