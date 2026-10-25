/**
 * Quick Academy Progressive Web App (PWA) Service Worker
 * Provides offline-first caching for courses, lessons, decagonal vector badges, and scripts.
 */

const CACHE_NAME = 'qsa-pwa-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/visuals.css',
  './css/quiz.css',
  './js/app.js',
  './js/router.js',
  './js/store.js',
  './js/lesson.js',
  './js/certificate.js',
  './js/thumbnails.js',
  './js/curriculum-synthesizer.js',
  './js/storage/idb.js',
  './js/components/uploader.js',
  './data/courses.json',
  './data/paths.json',
  './assets/images/hero-academy-emblem.svg',
  './assets/images/badge-thesis101.svg',
  './assets/images/badge-cite101.svg',
  './assets/images/badge-integrity101.svg',
  './assets/images/badge-edit101.svg',
  './assets/images/badge-lit-search.svg',
  './assets/images/badge-sample-size.svg',
  './assets/images/badge-spss101.svg',
  './assets/images/badge-smartpls.svg',
  './assets/images/badge-viva.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll skipped non-critical files:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and external third-party calls
  if (req.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // API calls are network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // App shell & static assets: Cache-first, fallback to network
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Asynchronously update cache in background (Stale-While-Revalidate)
        fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return res;
      }).catch(() => {
        // If navigation request fails offline, fallback to index.html
        if (req.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
