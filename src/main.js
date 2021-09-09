import TripPresenter from './presenter/trip.js';
import HeaderPresenter from './presenter/header.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Api from './api/api';
import OfferModel from './model/offers.js';
import DestinationModel from './model/destination.js';
import ProxyApi from './api/proxy-api.js';
import PointsStorage from './api/points-storage.js';
import DestinationsStorage from './api/destinations-storage.js';
import OffersStorage from './api/offers-storage.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';

const MAIN_URL = 'https://14.ecmascript.pages.academy/big-trip';
const AUTH_KEY = 'Basic ddedshdf64ScQflkaUhk';
const POINTS_PREFIX = 'big-trip--points';
const OFFERS_PREFIX = 'big-trip--offers';
const DESTINATIONS_PREFIX = 'big-trip--destinations';
const VERSION = '0.0.001';
const STORE_KEY_POINTS = `${POINTS_PREFIX}-${VERSION}`;
const STORE_KEY_OFFERS = `${OFFERS_PREFIX}-${VERSION}`;
const STORE_KEY_DESTINATIONS = `${DESTINATIONS_PREFIX}-${VERSION}`;

const api = new Api(MAIN_URL, AUTH_KEY);
const pointsStorage = new PointsStorage(STORE_KEY_POINTS, window.localStorage);
const offersStorage = new OffersStorage(STORE_KEY_OFFERS, window.localStorage);
const destinationsStorage = new DestinationsStorage(
  STORE_KEY_DESTINATIONS,
  window.localStorage,
);

const proxyApi = new ProxyApi(
  api,
  pointsStorage,
  offersStorage,
  destinationsStorage,
);

const infoContainer = document.querySelector('.trip-main');
const menuContainer = infoContainer.querySelector('.trip-controls__navigation');
const filterContainer = infoContainer.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('main .page-body__container');
const tripContainer = mainContainer.querySelector('.trip-events');

const pointsModel = new PointsModel(proxyApi);
const filterModel = new FilterModel();
const offersModel = new OfferModel();
const destinationsModel = new DestinationModel();

const offersPromise = proxyApi.getOffers();
const destinationsPromise = proxyApi.getDestinations();
const pointsPromise = proxyApi.getPoints();

const tripPresenter = new TripPresenter(
  tripContainer,
  pointsModel,
  filterModel,
  offersModel,
  destinationsModel,
);

const headerPresenter = new HeaderPresenter(
  mainContainer,
  filterContainer,
  menuContainer,
  infoContainer,
  pointsModel,
  filterModel,
  tripPresenter,
);

tripPresenter.showLoading();

Promise.all([offersPromise, destinationsPromise, pointsPromise])
  .then(([offers, destinations, points]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestination(destinations);
    pointsModel.setPoints(points);

    document.querySelector('.trip-main__event-add-btn').disabled = false;
    tripPresenter.hideLoading();
    tripPresenter.init();
    headerPresenter.init();
  })
  .catch((err) => {
    tripPresenter.hideLoading();
    tripPresenter.showServerError();
    throw err;
  });

if (!isOnline()) {
  document.title += ' [offline]';
}

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/serviceWorker.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  toast('online', 'green');

  proxyApi.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('offline');
});
