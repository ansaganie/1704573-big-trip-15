import { createTripInfo } from './view/trip-info.js';
import { createTripTabs } from './view/trip-tabs.js';
import { createTripCost } from './view/trip-cost';
import { createTripFilters } from './view/trip-filters.js';
import { createTripSort } from './view/trip-sort.js';
import { createEditForm } from './view/edit-form.js';
import { createEventList } from './view/event-list.js';
import { createEventItem } from './view/event-item.js';
import { cityNames, generatePoints } from './mock/event.js';
import { createTripInfoDate } from './utils/date.js';
import { capitalize } from './utils/string.js';
import { createEditFormOffers } from './view/edit-form-offer.js';
import { offers } from './mock/offer.js';
import { getRandomDestination } from './mock/destination.js';
import { createEditFormDestination } from './view/edit-form-destination.js';

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

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  if (i !== 0) {
    render(eventListElement, createEventItem(randomEvents[i]));
    continue;
  }
  render(eventListElement, createEditForm(randomEvents[i]));
}

render(tripEventsElement, eventListElement.outerHTML);

const eventEditElement = document.querySelector('.event--edit');
const eventTypeIconElement = eventEditElement.querySelector('.event__type-icon');
const eventTypeOutputElement = eventEditElement.querySelector('.event__type-output');
const eventTypeGroupElement = eventEditElement.querySelector('.event__type-group');
const eventDetailsElement = eventEditElement.querySelector('.event__details');
const eventDestinationInputElement = eventEditElement.querySelector('.event__input--destination');

const onEventTypeGroupChange = (event) => {
  const selectedEventType = event.target.value;

  eventTypeIconElement.src = `img/icons/${selectedEventType}.png`;
  eventTypeOutputElement.textContent = capitalize(selectedEventType);

  document.querySelector('.event__type-toggle').checked = false;

  const updatedOffers = createEditFormOffers(offers[selectedEventType]);
  eventDetailsElement.removeChild(eventDetailsElement.querySelector('.event__section--offers'));

  render(eventDetailsElement, updatedOffers, 'afterbegin');
};

const onEventDestinationInputChange = (event) => {
  const inputCityName = event.target.value;
  let updatedDestination = createEditFormDestination('');

  if (cityNames.includes(inputCityName)) {
    updatedDestination  = createEditFormDestination(getRandomDestination(inputCityName));
  }

  eventDetailsElement.removeChild(eventDetailsElement.querySelector('.event__section--destination'));
  render(eventDetailsElement, updatedDestination);
};

eventTypeGroupElement.addEventListener('change', onEventTypeGroupChange);
eventDestinationInputElement.addEventListener('change', onEventDestinationInputChange);
