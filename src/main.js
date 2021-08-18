import EventPresenter from './presenter/event.js';
import { generatePoints } from './mock/event.js';

const EVENT_ITEMS_COUNT = 15;

const randomEvents = generatePoints(EVENT_ITEMS_COUNT);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = tripMainElement.querySelector('.trip-controls__filters');

const tripEventsElement = document.querySelector('.trip-events');

const eventPresenter = new EventPresenter(
  tripMainElement,
  navigationElement,
  filterElement,
  tripEventsElement,
);

eventPresenter.init(randomEvents);

