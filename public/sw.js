const CACHE_NAME = 'vsn-cashews-v2';
const STATIC_CACHE = 'vsn-static-v2';
const IMAGE_CACHE = 'vsn-images-v2';
const API_CACHE = 'vsn-api-v2';

const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// 1. INSTALL EVENT - Precaching Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching App Shell & Offline Page');
      return cache.addAll(ASSETS_TO_PRECACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE EVENT - Cache Cleanup
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!allowedCaches.includes(cache)) {
            console.log('[SW] Deleting legacy cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH EVENT - Intelligent Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or non-http protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Strategy A: Navigation / HTML Page Requests -> Network First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh copy of page
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Strategy B: External Images (Unsplash, CDN) -> Cache First
  if (request.destination === 'image' || url.hostname.includes('unsplash.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy C: API Product Catalog GET Requests -> Stale While Revalidate
  if (url.pathname.startsWith('/api/products') || url.pathname.startsWith('/api/categories')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy D: Static App Bundle Assets (CSS, JS) -> Cache First with Network Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (url.origin === location.origin)) {
          const copy = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      });
    })
  );
});

// 4. BACKGROUND SYNC EVENT
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === 'sync-quotes' || event.tag === 'sync-orders') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'BACKGROUND_SYNC_COMPLETE',
            tag: event.tag,
            message: 'Connectivity restored. Orders/Quotes queued offline are synced.'
          });
        });
      })
    );
  }
});

// 5. PUSH NOTIFICATION LISTENER
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'V S N CASHEWS', body: 'New order update available!' };
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 6. NOTIFICATION CLICK LISTENER
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url || '/')
  );
});
