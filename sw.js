const CACHE = 'antifrod-v3';
const ASSETS = ['/congenial-guacamole/', '/congenial-guacamole/index.html', '/congenial-guacamole/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }).catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('fonts.googleapis') || e.request.url.includes('fonts.gstatic')) return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      var rc = r.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
      return r;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
