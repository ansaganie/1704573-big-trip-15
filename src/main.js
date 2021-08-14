import TripInfoView from './view/trip-info.js';
import TripTabsView from './view/trip-tabs.js';
import TripCostView from './view/trip-cost';
import TripFilterView from './view/trip-filters.js';
import TripSortView from './view/trip-sort.js';
import EventItemView from './view/EventList/event-item.js';
import EditFormView from './view/EditForm/edit-form.js';
import EventListView from './view/EventList/event-list.js';
import { isEscapePressed } from './utils/common.js';
import { render, RenderPosition, replace } from './utils/render.js';
import { generatePoints } from './mock/event.js';
import Message from './view/EventList/message.js';

const EVENT_ITEMS_COUNT = 0;
const currentFilter = 'everything';

const sortPointsByDateAscending = (first, second) =>
  new Date(first.dateFrom) - new Date(second.dateFrom);

const renderEventItem = (container, event) => {
  const eventItem = new EventItemView(event);
  const editForm = new EditFormView(event);

  const onEscKeydown = (evt) => {
    if (isEscapePressed(evt)) {
      replace(eventItem, editForm);

      editForm.unsetEscapeKeydownHandler();
      editForm.unsetFormSubmitHandler();
      editForm.unsetRollUpButtonClickHandler();
    }
  };

  const onEditFromSubmit = () => {
    replace(eventItem, editForm);

    editForm.unsetEscapeKeydownHandler();
    editForm.unsetFormSubmitHandler();
    editForm.unsetRollUpButtonClickHandler();
  };

  const onRollUpButtonClick = () => {
    replace(eventItem, editForm);

    editForm.unsetEscapeKeydownHandler();
    editForm.unsetFormSubmitHandler();
    editForm.unsetRollUpButtonClickHandler();
  };

  const onRollDownButtonClick = () => {
    replace(editForm, eventItem);

    editForm.setFormSubmitHandler(onEditFromSubmit);
    editForm.setEscapeKeydownHandler(onEscKeydown);
    editForm.setRollUpButtonClickHandler(onRollUpButtonClick);
  };

  render(container, eventItem);

  eventItem.setRollDownButtonClickHandler(onRollDownButtonClick);
};

const randomEvents = generatePoints(EVENT_ITEMS_COUNT).sort(
  sortPointsByDateAscending,
);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector(
  '.trip-controls__navigation',
);
const filterElement = tripMainElement.querySelector('.trip-controls__filters');

const tripEventsElement = document.querySelector('.trip-events');

const eventList = new EventListView();

render(navigationElement, new TripTabsView());
render(filterElement, new TripFilterView());

if (randomEvents.length === 0) {
  render(tripEventsElement, new Message(currentFilter));
} else {
  const tripInfo = new TripInfoView(randomEvents);
  render(tripEventsElement, new TripSortView());
  render(tripInfo, new TripCostView(randomEvents));
  render(tripMainElement, tripInfo, RenderPosition.AFTERBEGIN);

  for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
    renderEventItem(eventList, randomEvents[i]);
  }

  render(tripEventsElement, eventList);
}

