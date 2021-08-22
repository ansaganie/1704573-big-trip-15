import { capitalize } from '../../utils/common.js';
import { CITY_NAMES } from '../../mock/event.js';
import { offers as offersMock } from '../../mock/offer.js';
import { formatDate } from '../../utils/date.js';
import DestinationList from './destination-list.js';
import Destination from './destination.js';
import EventType from './event-type.js';
import Offers from './offer.js';
import Smart from '../../smart.js';

const BLANK_EVENT = {
  type: 'taxi',
  offers: offersMock['taxi'],
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
};

const createEditFormTemplate = (event = BLANK_EVENT) => {
  const { type, offers, destination, dateFrom, dateTo, basePrice } = event;
  const offersTemplate = new Offers(offers).getTemplate();
  const destinationListTemplate = new DestinationList(CITY_NAMES).getTemplate();
  const destinationTemplate = new Destination(destination).getTemplate();
  const eventTypeTemplate = new EventType(type).getTemplate();

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${eventTypeTemplate}
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalize(type)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1" type="text"
              name="event-destination"
              value="${destination.name}"
              list="destination-list-1">
            ${destinationListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${formatDate(dateFrom, 'dd/mm/yy hh:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${formatDate(dateTo, 'dd/mm/yy hh:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
    </li>`
  );
};

class EditForm extends Smart {
  constructor(state) {
    super();
    this._state = state;

    this._onRollUpButtonClick = this._onRollUpButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
    this._onEventTypeChange = this._onEventTypeChange.bind(this);

    this._setInnerEventHandlers();
  }

  getTemplate() {
    return createEditFormTemplate(this._state);
  }

  restoreHandlers() {
    this._setInnerEventHandlers();
    this.setEscapeKeydownHandler(this._callback.pressEscape);
    this.setFormSubmitHandler(this._callback.submitForm);
    this.setRollUpButtonClickHandler(this._callback.clickRollUpButton);
  }

  _setInnerEventHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._onEventTypeChange);
  }

  _onRollUpButtonClick(evt) {
    evt.preventDefault();
    this._callback.clickRollUpButton(evt);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitForm(evt);
  }

  _onEscapeKeydown(evt) {
    evt.preventDefault();
    this._callback.pressEscape(evt);
  }

  _onEventTypeChange({ target }) {
    this.updateState({
      offers: offersMock[target.value],
      type: target.value,
    });

    target.checked = false;
  }

  setRollUpButtonClickHandler(handler) {
    this._callback.clickRollUpButton = handler;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._onRollUpButtonClick);
  }

  setFormSubmitHandler(handler) {
    this._callback.submitForm = handler;
    this
      .getElement()
      .addEventListener('submit', this._onFormSubmit);
  }

  setEscapeKeydownHandler(handler) {
    this._callback.pressEscape = handler;
    document
      .addEventListener('keydown', this._onEscapeKeydown);
  }

  unsetEventHandlers() {
    this._callback.pressEscape = null;
    this._callback.submitForm = null;
    this._callback.clickRollUpButton = null;
    document
      .removeEventListener('keydown', this._onEscapeKeydown);

    this
      .getElement()
      .removeEventListener('submit', this._onFormSubmit);

    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .removeEventListener('click', this._onRollUpButtonClick);
  }
}

export default EditForm;
