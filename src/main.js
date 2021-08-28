import TripPresenter from './presenter/trip.js';
import HeaderPresenter from './presenter/header.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import { generatePoints } from './mock/event.js';

const TRIP_POINTS_COUNT = 15;

const randomPoints = generatePoints(TRIP_POINTS_COUNT);

const infoContainer = document.querySelector('.trip-main');
const menuContainer = infoContainer.querySelector(
  '.trip-controls__navigation',
);
const filterContainer = infoContainer.querySelector('.trip-controls__filters');

const tripContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.setPoints(randomPoints);

const filterModel = new FilterModel();

const headerPresenter = new HeaderPresenter(
  filterContainer,
  menuContainer,
  infoContainer,
  pointsModel,
  filterModel,
);

headerPresenter.init();

const tripPresenter = new TripPresenter(
  tripContainer,
  pointsModel,
  filterModel,
);

tripPresenter.init();
