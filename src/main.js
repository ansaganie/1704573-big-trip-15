import TripInfo from './view/trip-info.js';
import TripTabs from './view/trip-tabs.js';
import TripCost from './view/trip-cost';
import TripFilter from './view/trip-filters.js';
import TripSort from './view/trip-sort.js';
import EventItem from './view/EventList/event-item.js';
import EditForm from './view/EditForm/edit-form.js';
import EventList from './view/EventList/event-list.js';
import Destination from './view/EditForm/destination.js';
import { createTripInfoDate } from './date.js';
import { render, RenderPosition, capitalize } from './utils.js';
import { CITY_NAMES, generatePoints } from './mock/event.js';
import { offers } from './mock/offer.js';
import { getRandomDestination } from './mock/destination.js';
import Offers from './view/EditForm/offer.js';

const EVENT_ITEMS_COUNT = 15;

const sortPointsByDateAscending = (date1, date2) =>
  new Date(date1.dateFrom) - new Date(date2.dateFrom);

const randomEvents = generatePoints(EVENT_ITEMS_COUNT).sort(
  sortPointsByDateAscending,
);

const tripInfoCost = randomEvents
  .map(({ basePrice }) => basePrice)
  .reduce((acc, basePrice) => acc + basePrice);

const tripInfoTitle = randomEvents
  .map(({ destination }) => destination.name)
  .join(' &mdash; ');

const startDate = randomEvents[0].dateFrom;
const endDate = randomEvents[randomEvents.length - 1].dateTo;
const tripInfoDate = createTripInfoDate(startDate, endDate);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = tripMainElement.querySelector('.trip-controls__filters');

const tripEventsElement = document.querySelector('.trip-events');
const tripInfo = new TripInfo(tripInfoTitle, tripInfoDate);

const eventList = new EventList();

render(tripInfo.getElement(), new TripCost(tripInfoCost).getElement());
render(tripMainElement, tripInfo.getElement(), RenderPosition.AFTERBEGIN);
render(navigationElement, new TripTabs().getElement());
render(filterElement, new TripFilter().getElement());
render(tripEventsElement, new TripSort().getElement());

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  if (i !== 0) {
    render(eventList.getElement(), new EventItem(randomEvents[i]).getElement());
    continue;
  }
  render(eventList.getElement(), new EditForm(randomEvents[i]).getElement());
}

render(tripEventsElement, eventList.getElement());

const eventEditElement = document.querySelector('.event--edit');
const eventTypeIconElement =
  eventEditElement.querySelector('.event__type-icon');

const eventTypeOutputElement = eventEditElement.querySelector(
  '.event__type-output',
);

const eventTypeGroupElement =
  eventEditElement.querySelector('.event__type-group');

const eventDetailsElement = eventEditElement.querySelector('.event__details');
const eventDestinationInputElement = eventEditElement.querySelector(
  '.event__input--destination',
);

const eventTypeToggleElement = eventEditElement.querySelector(
  '.event__type-toggle',
);

const onEventTypeGroupChange = (event) => {
  const selectedEventType = event.target.value;

  eventTypeIconElement.src = `img/icons/${selectedEventType}.png`;
  eventTypeOutputElement.textContent = capitalize(selectedEventType);

  const updatedOffers = new Offers(offers[selectedEventType]).getElement();

  eventDetailsElement.querySelector('.event__section--offers').remove();

  render(eventDetailsElement, updatedOffers, 'afterbegin');

  eventTypeToggleElement.checked = false;
};

const onEventDestinationInputChange = (event) => {
  const inputCityName = event.target.value;
  let updatedDestination = new Destination('');

  if (CITY_NAMES.includes(inputCityName)) {
    updatedDestination = new Destination(getRandomDestination(inputCityName));
  }

  eventDetailsElement.querySelector('.event__section--destination').remove();

  render(eventDetailsElement, updatedDestination.getElement());
};

eventTypeGroupElement.addEventListener('change', onEventTypeGroupChange);
eventDestinationInputElement.addEventListener(
  'change',
  onEventDestinationInputChange,
);
