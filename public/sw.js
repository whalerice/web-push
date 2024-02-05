// install event
self.addEventListener('install', () => {
  console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] fetched resource ' + e.request.url);
});

// 웹 푸쉬 수신 시
self.addEventListener('push', (event) => {
  const text = event.data.text();
  event.waitUntil(
    self.registration.showNotification('웹 푸쉬!', {
      body: text,
      data: {
        url: 'www.naver.com',
      },
    }),
  );
});

// 푸쉬 알림 클릭 시
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
