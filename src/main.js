import { createTripInfo } from './view/trip-info.js';
import { createTripTabs } from './view/trip-tabs.js';
import { createTripCost } from './view/trip-cost';
import { createTripFilters } from './view/trip-filters.js';
import { createTripSort } from './view/trip-sort.js';
import { createEditForm } from './view/edit-form.js';
import { createEventList } from './view/event-list.js';
import { createEventItem } from './view/event-item.js';
import { generatePoints } from './mock/event.js';
import { createTripInfoDate } from './utils/date.js';
import { capitalize } from './utils/string.js';

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

const tripInfoCost = randomEvents
  .map(({basePrice}) => basePrice)
  .reduce((acc, basePrice) => acc + basePrice);

const tripInfoTitle = randomEvents.map(({ destination }) => destination.name).join(' &mdash; ');
const tripInfoDate = createTripInfoDate(randomEvents[0].dateFrom, randomEvents[randomEvents.length - 1].dateTo);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripInfoElement = stringToHTML(createTripInfo(tripInfoTitle, tripInfoDate));
const eventListElement = stringToHTML(createEventList());

render(tripInfoElement, createTripCost(tripInfoCost));
render(tripMainElement, tripInfoElement.outerHTML, 'afterbegin');
render(navigationElement, createTripTabs());
render(filterElement, createTripFilters());
render(tripEventsElement, createTripSort());
render(eventListElement, createEditForm(randomEvents[0]));

for (let i = 1; i < EVENT_ITEMS_COUNT; i++) {
  render(eventListElement, createEventItem(randomEvents[i]));
}

render(tripEventsElement, eventListElement.outerHTML);

const eventTypeIcon = document.querySelector('.event__type-icon');
const eventTypeOutput = document.querySelector('.event__type-output');
const eventTypeGroup = document.querySelector('.event__type-group');

const onEventTypeGroupChange = (event) => {
  eventTypeIcon.src = `img/icons/${event.target.value}.png`;
  eventTypeOutput.textContent = capitalize(event.target.value);
  document.querySelector('.event__type-toggle').checked = false;
};

eventTypeGroup.addEventListener('change', onEventTypeGroupChange);
