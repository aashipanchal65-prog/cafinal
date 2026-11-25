/**
 * STUDYVERSE – Service Worker
 * PWA Offline Caching & Background Sync
 */

const CACHE_NAME = 'studyverse-v1.2.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/css/variables.css',
  './src/css/reset.css',
  './src/css/base.css',
  './src/css/layout.css',
  './src/css/components.css',
  './src/css/sidebar.css',
  './src/css/dashboard.css',
  './src/css/tracker.css',
  './src/css/planner.css',
  './src/css/library.css',
  './src/css/ai.css',
  './src/css/revision.css',
  './src/css/mocktest.css',
  './src/css/notes.css',
  './src/css/games.css',
  './src/css/rewards.css',
  './src/css/analytics.css',
  './src/css/settings.css',
  './src/css/auth.css',
  './src/css/dark.css',
  './src/css/responsive.css',
  './src/css/animations.css',
  './src/js/core/config.js',
  './src/js/core/utils.js',
  './src/js/core/storage.js',
  './src/js/core/auth.js',
  './src/js/core/router.js',
  './src/js/core/eventbus.js',
  './src/js/core/theme.js',
  './src/js/core/notifications.js',
  './src/js/core/search.js',
  './src/js/core/timer.js',
  './src/js/core/sidebar.js',
  './src/js/data/syllabus-data.js',
  './src/js/data/spom-data.js',
  './src/js/data/resources-data.js',
  './src/js/modules/dashboard.js',
  './src/js/modules/tracker.js',
  './src/js/modules/planner.js',
  './src/js/modules/library.js',
  './src/js/modules/shared-library.js',
  './src/js/modules/ai-assistant.js',
  './src/js/modules/revision.js',
  './src/js/modules/revision-predictor.js',
  './src/js/modules/mocktest.js',
  './src/js/modules/notes.js',
  './src/js/modules/mistake-notebook.js',
  './src/js/modules/flashcards.js',
  './src/js/modules/analytics.js',
  './src/js/modules/energy-zone.js',
  './src/js/modules/gaming-zone.js',
  './src/js/modules/rewards.js',
  './src/js/modules/spom.js',
  './src/js/modules/settings.js',
  './src/js/modules/admin.js',
  './src/js/games/sudoku.js',
  './src/js/games/tictactoe.js',
  './src/js/games/memory-match.js',
  './src/js/games/word-puzzle.js',
  './src/js/games/ca-quiz.js',
  './src/js/games/ludo.js',
  './src/js/games/chess.js',
  './src/js/games/snakes-ladders.js',
  './src/js/games/number-puzzle.js',
  './src/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache partial skip:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('/index.html');
        }
      });
    })
  );
});
