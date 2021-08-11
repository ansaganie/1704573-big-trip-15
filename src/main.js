import TripInfo from './view/trip-info.js';
import TripTabs from './view/trip-tabs.js';
import TripCost from './view/trip-cost';
import TripFilter from './view/trip-filters.js';
import TripSort from './view/trip-sort.js';
import EventItem from './view/EventList/event-item.js';
import EditForm from './view/EditForm/edit-form.js';
import EventList from './view/EventList/event-list.js';
import { createTripInfoDate } from './date.js';
import { isEscapePressed, render, RenderPosition } from './utils.js';
import { generatePoints } from './mock/event.js';

const EVENT_ITEMS_COUNT = 15;

const sortPointsByDateAscending = (date1, date2) =>
  new Date(date1.dateFrom) - new Date(date2.dateFrom);

const renderEventItem = (container, event) => {
  const eventItem = new EventItem(event);
  const editForm = new EditForm(event);
  const eventItemElement = eventItem.getElement();
  const formElement = editForm.getElement();

  const changeEventItemToForm = () => {
    container.replaceChild(formElement, eventItemElement);
  };

  const changeFormToEventItem = () => {
    container.replaceChild(eventItemElement, formElement);
  };

  const onEscKeydown = (evt) => {
    if (isEscapePressed(evt)) {
      changeFormToEventItem();

      editForm.unsetEscapeKeydownHandler();
      editForm.unsetFormSubmitHandler();
      editForm.unsetRollUpButtonClickHandler();
    }
  };

  const onEditFromSubmit = () => {
    changeFormToEventItem();

    editForm.unsetEscapeKeydownHandler();
    editForm.unsetFormSubmitHandler();
    editForm.unsetRollUpButtonClickHandler();
  };

  const onRollUpButtonClick = () => {
    changeFormToEventItem();

    editForm.unsetEscapeKeydownHandler();
    editForm.unsetFormSubmitHandler();
    editForm.unsetRollUpButtonClickHandler();
  };

  const onRollDownButtonClick = () => {
    changeEventItemToForm();

    editForm.setFormSubmitHandler(onEditFromSubmit);
    editForm.setEscapeKeydownHandler(onEscKeydown);
    editForm.setRollUpButtonClickHandler(onRollUpButtonClick);
  };

  render(container, eventItem.getElement());

  eventItem.setRollDownButtonClickHandler(onRollDownButtonClick);
};

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
  renderEventItem(eventListElement, randomEvents[i]);
}

render(tripEventsElement, eventListElement);
