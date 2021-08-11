import TripInfo from './view/trip-info.js';
import TripTabs from './view/trip-tabs.js';
import TripCost from './view/trip-cost';
import TripFilter from './view/trip-filters.js';
import TripSort from './view/trip-sort.js';
import EventItem from './view/EventList/event-item.js';
import EditForm from './view/EditForm/edit-form.js';
import EventList from './view/EventList/event-list.js';
import { isEscapePressed} from './utils/common.js';
import { render, RenderPosition, replace } from './utils/render.js';
import { generatePoints } from './mock/event.js';

const EVENT_ITEMS_COUNT = 15;

const sortPointsByDateAscending = (date1, date2) =>
  new Date(date1.dateFrom) - new Date(date2.dateFrom);

const renderEventItem = (container, event) => {
  const eventItem = new EventItem(event);
  const editForm = new EditForm(event);

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
const tripInfo = new TripInfo(randomEvents);

const eventList = new EventList();

render(tripInfo, new TripCost(randomEvents));
render(tripMainElement, tripInfo, RenderPosition.AFTERBEGIN);
render(navigationElement, new TripTabs());
render(filterElement, new TripFilter());
render(tripEventsElement, new TripSort());

for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
  renderEventItem(eventList, randomEvents[i]);
}

render(tripEventsElement, eventList);
