import { capitalize } from '../../utils/common.js';
import { CITY_NAMES } from '../../mock/event.js';
import { offers as offersMock } from '../../mock/offer.js';
import { isDateEquals, formatDate, isBefore } from '../../utils/date.js';
import CityNames from './city-names.js';
import Destination from './destination.js';
import EventType from './event-type.js';
import Offers from './offer.js';
import SmartView from '../smart.js';
import { getRandomDestination } from '../../mock/destination.js';
import flatpickr from 'flatpickr';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../../node_modules/flatpickr/dist/themes/airbnb.css';

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
    hasBasePrice,
    hasCityName,
  } = event;
  const offersTemplate = hasOffers ? new Offers(offers).getTemplate() : '';
  const destinationListTemplate = new CityNames(CITY_NAMES).getTemplate();

  const destinationTemplate =
    hasPictures || hasDescription
      ? new Destination(destination, hasDescription, hasPictures).getTemplate()
      : '' ;

  const eventTypeTemplate = new EventType(type).getTemplate();
  const isSaveDisabled = !hasBasePrice || !hasCityName || !dateFrom || !dateTo;

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

          <button class="event__save-btn  btn  btn--blue" type="submit"
            ${isSaveDisabled ? 'disabled' : ''}>Save</button>
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

class EditForm extends SmartView {
  constructor(pointData) {
    super();
    this._offerId = 0;
    this._datePickerFrom = null;
    this._datePickerTo = null;
    this._numberPattern = /^\d+$/;

    this._state = this._convertPointDataToState(pointData);

    this._onRollUpButtonClick = this._onRollUpButtonClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);

    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onCityNameChange = this._onCityNameChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setDatePicker();
    this._setInnerEventHandlers();
  }

  getTemplate() {
    return createEditFormTemplate(this._state);
  }

  restoreHandlers() {
    this._setDatePicker();
    this._setInnerEventHandlers();
    this.setFormSubmitHandler(this._callback.submitForm);
    this.setRollUpButtonClickHandler(this._callback.clickRollUpButton);
  }

  resetState(pointData) {
    this.updateState(
      this._convertPointDataToState(pointData),
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

  setDeleteClickHandler(handler) {
    this._callback.clickDelete = handler;
    this
      .getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._onDeleteButtonClick);
  }

  unsetEventHandlers() {
    this._callback.submitForm = null;
    this._callback.clickRollUpButton = null;

    this
      .getElement()
      .removeEventListener('submit', this._onFormSubmit);

    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .removeEventListener('click', this._onRollUpButtonClick);
  }

  removeElement() {
    super.removeElement();

    if (this._datePickerFrom || this._datePickerTo) {
      this._datePickerFrom.destroy();
      this._datePickerFrom = null;
      this._datePickerTo.destroy();
      this._datePickerTo = null;
    }
  }

  _setDatePicker() {
    if (this._datePickerFrom || this._datePickerTo) {
      this._datePickerFrom.destroy();
      this._datePickerTo.destroy();
    }

    this._datePickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        closeOnSelect: false,
        'time_24hr': true,
        onClose: this._dateFromChangeHandler,
      },
    );

    this._datePickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        closeOnSelect: false,
        minDate: this._state.dateFrom,
        'time_24hr': true,
        onClose: this._dateToChangeHandler,
      },
    );
  }

  _setInnerEventHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._onEventTypeChange);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._onPriceChange);

    const availableOffers = this.getElement()
      .querySelector('.event__available-offers');

    if (availableOffers) {
      availableOffers.addEventListener('change', this._onOffersChange);
    }
  }

  _convertPointDataToState(event) {
    const offers = event.offers.map((offer) => ({
      ...offer,
      id: this._offerId++,
    }));

    return {
      ...event,
      offers,
      hasOffers: event.offers.length !== 0,
      hasDescription: event.destination.description.length !== 0,
      hasPictures: event.destination.pictures.length !== 0,
      hasBasePrice: true,
      hasCityName: true,
    };
  }

  _convertStateToPointData(state) {
    delete state.hasDescription;
    delete state.hasPictures;
    delete state.hasOffers;
    delete state.hasBasePrice;
    state.offers.forEach((offer) => delete offer.id);

    return state;
  }

  _dateFromChangeHandler([userDate]) {
    if (!isDateEquals(userDate, this._state.dateFrom)) {
      const update = {
        dateFrom: userDate,
      };

      if (isBefore(this._state.dateTo, userDate)) {
        update.dateTo = userDate;
      }

      this.updateState(update);
    }
  }

  _dateToChangeHandler([userDate]) {
    if (!isDateEquals(userDate, this._state.dateTo)) {
      this.updateState({
        dateTo: userDate,
      });
    }
  }

  _onPriceChange({ target }) {
    const value = target.value;

    const update = {
      hasBasePrice: false,
    };

    if (value.length !== 0 && this._numberPattern.test(value)) {
      update.hasBasePrice = true;
      update.basePrice = +value;
    } else {
      update.basePrice = value;
    }

    this.updateState(update);
  }

  _onRollUpButtonClick(evt) {
    evt.preventDefault();
    this._callback.clickRollUpButton();
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitForm(
      this._convertStateToPointData(this._state),
    );
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    this._callback.clickDelete(
      this._convertStateToPointData(this._state),
    );
  }

  _onEventTypeChange({ target }) {
    const offers = offersMock[target.value].map((offer) => ({
      ...offer,
      isChecked: false,
      id: this._offerId++,
    }));

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
      const offers = this._state
        .offers
        .slice()
        .map((offer) => {
          if(offer.id === +target.id) {
            return {
              ...offer,
              isChecked: target.checked,
            };
          }

          return offer;
        });

      this.updateState({ offers }, true);
    }
  }

  _onCityNameChange({ target }) {
    const cityName = target.value;

    if (CITY_NAMES.includes(cityName)) {
      const destination = getRandomDestination(cityName);
      const updatedState = {
        destination,
        hasDescription: destination.description.length !== 0,
        hasPictures: destination.pictures.length !== 0,
        hasCityName: true,
        hasBasePrice: true,
      };

      this.updateState(updatedState);
    } else {
      this.updateState({
        destination: {
          name: cityName,
        },
        hasDescription: false,
        hasPictures: false,
        hasCityName: false,
      });
    }
  }
}

export default EditForm;
