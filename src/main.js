import { createTripInfo } from './view/trip-info.js';
import { createTripTabs } from './view/trip-tabs.js';
import { createTripCost } from './view/trip-cost';
import { createTripFilters } from './view/trip-filters.js';
import { createTripSort } from './view/trip-sort.js';
import { createNewEventForm } from './view/new-event-form.js';
import { createEventList } from './view/event-list.js';
import { createEventItem } from './view/event-item.js';
import { generatePoints } from './mock/event.js';

const EVENT_ITEMS_COUNT = 15;

const render = (container, element, position = 'beforeend') => {
  container.insertAdjacentHTML(position, element);
};

const stringToHTML = (input) => {
  const template = document.createElement('template');
  template.innerHTML = input.trim();
  return template.content.firstChild;
};

const sortPointsByDateAscending = (date1, date2) =>
  new Date(date1.dateFrom) - new Date(date2.dateFrom);

const randomEvents = generatePoints(EVENT_ITEMS_COUNT)
  .sort(sortPointsByDateAscending);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripInfoElement = stringToHTML(createTripInfo());
const eventListElement = stringToHTML(createEventList());

render(tripInfoElement, createTripCost());
render(tripMainElement, tripInfoElement.outerHTML, 'afterbegin');
render(navigationElement, createTripTabs());
render(filterElement, createTripFilters());
render(tripEventsElement, createTripSort());
render(eventListElement, createNewEventForm());

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  render(eventListElement, createEventItem(randomEvents[i]));
}

render(tripEventsElement, eventListElement.outerHTML);
