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

const EVENT_ITEMS_COUNT = 15;

const sortPointsByDateAscending = (event1, event2) =>
  new Date(event1.dateFrom) - new Date(event2.dateFrom);

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
const tripInfo = new TripInfoView(randomEvents);

const eventList = new EventListView();

render(tripInfo, new TripCostView(randomEvents));
render(tripMainElement, tripInfo, RenderPosition.AFTERBEGIN);
render(navigationElement, new TripTabsView());
render(filterElement, new TripFilterView());
render(tripEventsElement, new TripSortView());

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  console.log(randomEvents[i]);
  renderEventItem(eventList, randomEvents[i]);
}

render(tripEventsElement, eventList);
