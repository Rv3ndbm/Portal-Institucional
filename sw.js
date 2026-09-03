// ============================================================
// SERVICE WORKER - PWA I.E. Gilberto Alzate Avendaño
// ============================================================

const CACHE_NAME = 'gaa-portal-v2.1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    './vendor/fontawesome/css/all.min.css',
    './css/styles.css?v=2.5',
    './css/variables.css',
    './css/modern-theme.css',
    './css/index.css',
    './css/index_new.css',
    './css/accessibility.css',
    './css/search.css',
    './js/script.js',
    './js/search-data.js',
    './js/accessibility.js',
    './img/logo_del_colegio-removebg-preview__1_-removebg-preview.png',
    './img/logo del colegio.jpg'
];

// Instalación: Precacheo de activos críticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('Algunos activos no pudieron ser precacheados:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activación: Limpieza de versiones antiguas de caché
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptor de peticiones: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
    // Solo manejar peticiones GET
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // No cachear llamadas dinámicas a PHP admin o API para no romper sesiones o estados en vivo
    if (url.pathname.includes('/php/admin/') || url.pathname.includes('api_aviso.php')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Si no hay red, servir desde caché
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return new Response('Sin conexión a internet', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    });
                });
            })
    );
});
