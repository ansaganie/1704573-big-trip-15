import TripPresenter from './presenter/trip.js';
import HeaderPresenter from './presenter/header.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Api from './api';
import OfferModel from './model/offers.js';
import DestinationModel from './model/destination.js';

const MAIN_URL = 'https://15.ecmascript.pages.academy/big-trip';
const AUTH_KEY = 'Basic dde64ScQvzaUhkmz';
const api = new Api(MAIN_URL, AUTH_KEY);

const infoContainer = document.querySelector('.trip-main');
const menuContainer = infoContainer.querySelector('.trip-controls__navigation');
const filterContainer = infoContainer.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('main .page-body__container');
const tripContainer = mainContainer.querySelector('.trip-events');

const pointsModel = new PointsModel(api);
const filterModel = new FilterModel();
const offersModel = new OfferModel();
const destinationsModel = new DestinationModel();

const offersPromise = api.getOffers();
const destinationsPromise = api.getDestinations();
const pointsPromise = api.getPoints();

Promise.all([offersPromise, destinationsPromise, pointsPromise]).then(
  ([offers, destinations, points]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestination(destinations);
    pointsModel.setPoints(points);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  },
).catch(() => {
  //TODO: show error message
});

const tripPresenter = new TripPresenter(
  tripContainer,
  pointsModel,
  filterModel,
  offersModel.getOffers(),
  destinationsModel.getDestinations(),
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

headerPresenter.init();
tripPresenter.init();
