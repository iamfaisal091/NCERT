const CACHE_NAME = 'blog-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/blog.html',
  '/data.json'
];

// Service Worker इंस्टॉलेशन
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// फेच रिक्वेस्ट हैंडल करना
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // कैश से रिस्पॉन्स
        }
        return fetch(event.request).then(networkResponse => {
          // इमेजेज़ को कैश करें
          if (event.request.url.match(/\.(?:png|jpg|jpeg|gif)$/)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
  );
});
