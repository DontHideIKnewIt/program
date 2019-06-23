

self.addEventListener('install', (event) =>  {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['./index.html','./lingkaran.png','./persegi.png','./ppanjang.png','./segitiga.png']);
  }());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('index.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});
