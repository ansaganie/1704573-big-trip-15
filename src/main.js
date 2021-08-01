import { createTripInfo } from './view/trip-info.js';
import { createTripTabs } from './view/trip-tabs.js';
import { createTripCost } from './view/trip-cost';
import { createTripFilters } from './view/trip-filters.js';
import { createTripSort } from './view/trip-sort.js';
import { createNewEventForm } from './view/new-event-form.js';
import { createEventList } from './view/event-list.js';
import { createEventItem } from './view/event-item.js';

const Positions = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};

render(tripMainElement, createTripInfo(), Positions.AFTER_BEGIN);

const tripInfoElement = tripMainElement.querySelector('.trip-main__trip-info');
render(tripInfoElement, createTripCost(), Positions.BEFORE_END);

render(navigationElement, createTripTabs(), Positions.BEFORE_END);
render(filterElement, createTripFilters(), Positions.BEFORE_END);
render(tripEventsElement, createTripSort(), Positions.BEFORE_END);
render(tripEventsElement, createEventList(), Positions.BEFORE_END);

const eventListElement = tripEventsElement.querySelector('.trip-events__list');
render(eventListElement, createNewEventForm(), Positions.BEFORE_END);

for (let i = 0; i < 3; i++) {
  render(eventListElement, createEventItem(), Positions.BEFORE_END);
}
