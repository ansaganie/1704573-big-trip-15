import TripPresenter from './presenter/trip.js';
import HeaderPresenter from './presenter/header.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import { generatePoints } from './mock/event.js';

const TRIP_POINTS_COUNT = 15;

const randomPoints = generatePoints(TRIP_POINTS_COUNT);

const infoContainer = document.querySelector('.trip-main');
const menuContainer = infoContainer.querySelector('.trip-controls__navigation');
const filterContainer = infoContainer.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('main .page-body__container');
const tripContainer = mainContainer.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.setPoints(randomPoints);

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(
  tripContainer,
  pointsModel,
  filterModel,
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
