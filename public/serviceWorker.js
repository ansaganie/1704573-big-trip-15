const CACHE_PREFIX = 'big-trip';
const CACHE_VERSION = '0.0.001';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const styles = ['/css/style.css'];
const fonts = [
  '/fonts/Montserrat-Bold.woff2',
  '/fonts/Montserrat-ExtraBold.woff2',
  '/fonts/Montserrat-Medium.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/fonts/Montserrat-SemiBold.woff2',
];
const img = [
  '/img/header-bg.png',
  '/img/header-bg@2x.png',
  '/img/logo.png',
  '/img/icons/bus.png',
  '/img/icons/check-in.png',
  '/img/icons/drive.png',
  '/img/icons/flight.png',
  '/img/icons/restaurant.png',
  '/img/icons/ship.png',
  '/img/icons/sightseeing.png',
  '/img/icons/taxi.png',
  '/img/icons/train.png',
  '/img/icons/transport.png',
];

const js = ['/bundle.js'];

const files = [...styles, ...img, ...fonts, ...js ];

const onServiceWorkerInstall = (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cash) => cash.addAll(files)),
  );
};

const onServiceWorkerActivate = (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((keys) => {
        Promise.all(
          keys.map((key) => {
            if(key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
              return caches.delete(key);
            }

            return null;
          }).filter((key) => key !== null),
        );
      }),
  );
};

const onServiceWorkerFetch = (evt) => {
  const { request } = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheMatch) => {
        if (cacheMatch) {
          return cacheMatch;
        }

        return fetch(request)
          .then((response) => {
            if(
              !response ||
              response.status !== HTTP_STATUS_OK ||
              response.type !== RESPONSE_SAFE_TYPE
            ) {
              return response;
            }

            const responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));

            return response;
          });
      }),
  );
};

self.addEventListener('install', onServiceWorkerInstall);
self.addEventListener('activate', onServiceWorkerActivate);
self.addEventListener('fetch', onServiceWorkerFetch);
