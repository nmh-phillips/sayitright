// Harlo service worker: makes the site installable and quick to open.
// Pages and scripts: network first (so updates show straight away), cached copy if offline.
// Icons, photos and the speech script: cache first. API calls are never cached.
const CACHE = 'harlo-v9';
const CORE = ['/', '/index.html', '/phrases.js', '/i18n.js', '/assess.js', '/pron.js', '/manifest.webmanifest', '/icons/icon-192.png',
  '/travel/', '/travel/travel.js', '/travel/travel.css', '/fx.js', '/dog.js', '/dress.js']; // Harlo Travel works offline
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/.netlify/') || url.pathname === '/stats.html' || url.pathname === '/voice.html') return;
  const staticAsset = /\.(png|jpg|jpeg|svg|webp|woff2)$/.test(url.pathname) || url.pathname.startsWith('/vendor/') || url.pathname.startsWith('/fonts/');
  if (staticAsset) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); } return res; })));
  } else {
    e.respondWith(fetch(req).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); } return res; }).catch(() => caches.match(req).then(hit => hit || caches.match('/'))));
  }
});
