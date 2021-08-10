import TripInfo from './view/trip-info.js';
import TripTabs from './view/trip-tabs.js';
import TripCost from './view/trip-cost';
import TripFilter from './view/trip-filters.js';
import TripSort from './view/trip-sort.js';
import EventItem from './view/EventList/event-item.js';
import EditForm from './view/EditForm/edit-form.js';
import EventList from './view/EventList/event-list.js';
import { createTripInfoDate } from './date.js';
import { render, RenderPosition } from './utils.js';
import { generatePoints } from './mock/event.js';

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
const eventListElement = eventList.getElement();

render(tripInfo.getElement(), new TripCost(tripInfoCost).getElement());
render(tripMainElement, tripInfo.getElement(), RenderPosition.AFTERBEGIN);
render(navigationElement, new TripTabs().getElement());
render(filterElement, new TripFilter().getElement());
render(tripEventsElement, new TripSort().getElement());

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  const eventItem = new EventItem(randomEvents[i]);
  const editForm = new EditForm(randomEvents[i]);
  const formElement = editForm.getElement();
  const eventItemElement = eventItem.getElement();
  const rollUpButton = eventItemElement.querySelector('.event__rollup-btn');

  const onEditFromSubmit = () => {
    eventListElement.replaceChild(eventItemElement, formElement);
  };

  const onRollUpButtonClick = () => {
    eventListElement.replaceChild(formElement, eventItemElement);

    formElement.addEventListener('submit', onEditFromSubmit);
  };

  render(eventListElement, eventItem.getElement());

  rollUpButton.addEventListener('click', onRollUpButtonClick);
}

render(tripEventsElement, eventListElement);
