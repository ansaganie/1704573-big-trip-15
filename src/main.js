import TripTabsView from './view/trip-tabs.js';
import TripFilterView from './view/trip-filters.js';
import TripInfoView from './view/trip-info.js';
import TripPresenter from './presenter/trip.js';
import { generatePoints } from './mock/event.js';
import { render, RenderPosition } from './utils/render.js';

const TRIP_POINTS_COUNT = 15;

const randomPoints = generatePoints(TRIP_POINTS_COUNT);

const infoContainer = document.querySelector('.trip-main');
const tabsContainer = infoContainer.querySelector(
  '.trip-controls__navigation',
);
const filterContainer = infoContainer.querySelector('.trip-controls__filters');

const tripContainer = document.querySelector('.trip-events');

const tabsComponent = new TripTabsView();
const filtersComponent = new TripFilterView();
const infoComponent = new TripInfoView(randomPoints);

render(tabsContainer, tabsComponent);
render(filterContainer, filtersComponent);
render(infoContainer, infoComponent, RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(
  tripContainer,
);

tripPresenter.init(randomPoints);

