import { capitalize } from '../../utils/common.js';
import { CITY_NAMES } from '../../mock/event.js';
import { offers as offersMock } from '../../mock/offer.js';
import { formatDate } from '../../utils/date.js';
import CityNames from './city-names.js';
import Destination from './destination.js';
import EventType from './event-type.js';
import Offers from './offer.js';
import Smart from '../../smart.js';
import { getRandomDestination } from '../../mock/destination.js';

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
  const {
    type,
    offers,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    hasDescription,
    hasPictures,
    hasOffers,
    isSaveDisabled,
  } = event;
  const offersTemplate = hasOffers ? new Offers(offers).getTemplate() : '';
  const destinationListTemplate = new CityNames(CITY_NAMES).getTemplate();

  const destinationTemplate =
    hasPictures || hasDescription
      ? new Destination(destination, hasDescription, hasPictures).getTemplate() : '' ;

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

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveDisabled ? 'disabled' : ''}>Save</button>
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
  constructor(event) {
    super();
    this._state = EditForm.convertEventToState(event);

    this._onRollUpButtonClick = this._onRollUpButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onCityNameChange = this._onCityNameChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);

    this._setInnerEventHandlers();
  }

  static convertEventToState(event) {
    const offers = event.offers.map((offer) => ({
      ...offer,
      id: offer.title.toLowerCase().replaceAll(' ', '-'),
    }));

    return {
      ...event,
      offers,
      hasOffers: event.offers.length !== 0,
      hasDescription: event.destination.description.length !== 0,
      hasPictures: event.destination.pictures.length !== 0,
      isSaveDisabled: false,
    };
  }

  static convertStateToEvent(state) {
    delete state.hasDescription;
    delete state.hasPictures;
    delete state.hasOffers;
    state.offers.forEach((offer) => delete offer.id);

    return state;
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

  resetState(event) {
    this.updateState(
      EditForm.convertEventToState(event),
    );
  }

  setRollUpButtonClickHandler(handler) {
    this._callback.clickRollUpButton = handler;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._onRollUpButtonClick);
    this
      .getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._onCityNameChange);
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

  _setInnerEventHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._onEventTypeChange);
    const availableOffers = this.getElement()
      .querySelector('.event__available-offers');

    if (availableOffers) {
      availableOffers.addEventListener('change', this._onOffersChange);
    }
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
    this._callback.pressEscape(evt);
  }

  _onEventTypeChange({ target }) {
    const offers = offersMock[target.value];
    offers.forEach((offer) => offer.isChecked = false);
    const updatedState = {
      offers,
      hasOffers: offers.length !== 0,
      type: target.value,
    };

    this.updateState(updatedState);

    target.checked = false;
  }

  _onOffersChange({ target }) {
    if (target.tagName === 'INPUT') {
      const offers = this._state.offers.slice();
      offers.forEach((offer) => {
        if(offer.id === target.id) {
          offer.isChecked = target.checked;
        }
      });

      this.updateState({ offers });
    }
  }

  _onCityNameChange(evt) {
    const cityName = evt.target.value;

    if (CITY_NAMES.includes(cityName)) {
      const destination = getRandomDestination(cityName);
      const updatedState = {
        destination,
        hasDescription: destination.description.length !== 0,
        hasPictures: destination.pictures.length !== 0,
        isSaveDisabled: false,
      };

      this.updateState(updatedState);
    } else {
      this.updateState({
        destination: {
          name: cityName,
        },
        hasDescription: false,
        hasPictures: false,
        isSaveDisabled: true,
      });
    }
  }
}

export default EditForm;
