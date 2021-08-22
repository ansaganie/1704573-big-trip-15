import TripTabsView from './view/trip-tabs.js';
import TripFilterView from './view/trip-filters.js';
import TripInfoView from './view/trip-info.js';
import EventPresenter from './presenter/event.js';
import { generatePoints } from './mock/event.js';
import { render, RenderPosition } from './utils/render.js';

const EVENT_ITEMS_COUNT = 0;

const randomEvents = generatePoints(EVENT_ITEMS_COUNT);

const infoContainer = document.querySelector('.trip-main');
const tabsContainer = infoContainer.querySelector(
  '.trip-controls__navigation',
);
const filterContainer = infoContainer.querySelector('.trip-controls__filters');

const tripEventsElement = document.querySelector('.trip-events');

const tabsComponent = new TripTabsView();
const filtersComponent = new TripFilterView();
const infoComponent = new TripInfoView(randomEvents);

render(tabsContainer, tabsComponent);
render(filterContainer, filtersComponent);
render(infoContainer, infoComponent, RenderPosition.AFTERBEGIN);

const eventPresenter = new EventPresenter(
  tripEventsElement,
);

eventPresenter.init(randomEvents);
