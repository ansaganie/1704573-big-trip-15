const CACHE_PREFIX = 'big-trip';
const CACHE_VERSION = '0.0.001';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const styles = ['/1704573-big-trip-15/16/css/style.css'];
const fonts = [
  '/1704573-big-trip-15/16/fonts/Montserrat-Bold.woff2',
  '/1704573-big-trip-15/16/fonts/Montserrat-ExtraBold.woff2',
  '/1704573-big-trip-15/16/fonts/Montserrat-Medium.woff2',
  '/1704573-big-trip-15/16/fonts/Montserrat-Regular.woff2',
  '/1704573-big-trip-15/16/fonts/Montserrat-SemiBold.woff2',
];
const img = [
  '/1704573-big-trip-15/16/img/header-bg.png',
  '/1704573-big-trip-15/16/img/header-bg@2x.png',
  '/1704573-big-trip-15/16/img/logo.png',
  '/1704573-big-trip-15/16/img/icons/bus.png',
  '/1704573-big-trip-15/16/img/icons/check-in.png',
  '/1704573-big-trip-15/16/img/icons/drive.png',
  '/1704573-big-trip-15/16/img/icons/flight.png',
  '/1704573-big-trip-15/16/img/icons/restaurant.png',
  '/1704573-big-trip-15/16/img/icons/ship.png',
  '/1704573-big-trip-15/16/img/icons/sightseeing.png',
  '/1704573-big-trip-15/16/img/icons/taxi.png',
  '/1704573-big-trip-15/16/img/icons/train.png',
  '/1704573-big-trip-15/16/img/icons/transport.png',
];

const js = ['/1704573-big-trip-15/16/bundle.js'];

const files = ['/1704573-big-trip-15/16/', ...styles, ...img, ...fonts, ...js ];

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
