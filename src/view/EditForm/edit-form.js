import { capitalize } from 'lodash';
import { isDateEquals, formatDate, isBefore } from '../../utils/date.js';
import CityNames from './city-names.js';
import Destination from './destination.js';
import EventType from './event-type.js';
import Offers from './offers.js';
import SmartView from '../smart.js';
import flatpickr from 'flatpickr';
import { nanoid } from 'nanoid';

import '../../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../../node_modules/flatpickr/dist/themes/airbnb.css';

const NUMBER_PATTERN = /^\d+$/;

const createEditFormTemplate = (point, cityNames, types, isNewPoint) => {
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
  } = point;
  const offersTemplate = hasOffers ? new Offers(offers).getTemplate() : '';
  const cityListTemplate = new CityNames(cityNames).getTemplate();

  const destinationTemplate =
    hasPictures || hasDescription
      ? new Destination(destination, hasDescription, hasPictures).getTemplate()
      : '' ;

  const eventTypeTemplate = new EventType(type, types).getTemplate();
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
              list="destination-list-1"
              autocomplete="off">
            ${cityListTemplate}
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
              type="number"
              name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit"
            ${isSaveDisabled ? 'disabled' : ''}>Save</button>
          <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
          ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Close event</span>
            </button>`}
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
  constructor(
    offersData,
    cityNamesData,
    destinationsData,
    pointData,
  ) {
    super();
    this._offersData = offersData;
    this._cityNamesData = cityNamesData;
    this._destinationsData = destinationsData;

    this._state = null;
    this._isNewPoint = true;

    if (pointData) {
      this._state = this._convertPointDataToState(pointData);
      this._isNewPoint = false;
    }

    this._datePickerFrom = null;
    this._datePickerTo = null;

    this._rollUpClickHandler = this._rollUpClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityNameChangeHandler = this._cityNameChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._showDeleting = this._showDeleting.bind(this);
    this._hideDeleting = this._hideDeleting.bind(this);
    this._showSaving = this._showSaving.bind(this);
    this._hideSaving = this._hideSaving.bind(this);
    this._showError = this._showError.bind(this);
    this._removeError = this._removeError.bind(this);

    this._setDatePicker();
    this._setInnerEventHandlers();
  }

  getTemplate() {
    if (this._state === null) {
      this._state = this._convertPointDataToState({
        type: 'taxi',
        offers: [],
        destination: this._destinationsData[0],
        dateFrom: new Date(),
        dateTo: new Date(),
        basePrice: 0,
        isFavorite: false,
      });
    }

    return createEditFormTemplate(
      this._state,
      this._cityNamesData,
      Object.keys(this._offersData),
      this._isNewPoint,
    );
  }

  restoreEventHandlers() {
    this._setDatePicker();
    this._setInnerEventHandlers();
    this.setFormSubmitHandler(this._callback.submitForm);
    this.setDeleteClickHandler(this._callback.clickDelete);

    if (!this._isNewPoint) {
      this.setRollUpButtonClickHandler(this._callback.clickRollUpButton);
    }
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
      .addEventListener('click', this._rollUpClickHandler);
    this
      .getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._cityNameChangeHandler);
  }

  setFormSubmitHandler(handler) {
    this._callback.submitForm = handler;
    this
      .getElement()
      .addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(handler) {
    this._callback.clickDelete = handler;
    this
      .getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._deleteClickHandler);
  }

  unsetEventHandlers() {
    this._callback.submitForm = null;
    this._callback.clickRollUpButton = null;

    this
      .getElement()
      .removeEventListener('submit', this._formSubmitHandler);

    if (!this._isNewPoint) {
      this
        .getElement()
        .querySelector('.event__rollup-btn')
        .removeEventListener('click', this._rollUpClickHandler);
    }
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

  _showDeleting() {
    this.getElement().querySelector('.event__reset-btn').textContent = 'Deleting';
    this._disableForm();
  }

  _hideDeleting() {
    this.getElement().querySelector('.event__reset-btn').textContent = 'Delete';
    this._enableForm();
  }

  _showSaving() {
    this.getElement().querySelector('.event__save-btn').textContent = 'Saving';
    this._disableForm();
  }

  _hideSaving() {
    this.getElement().querySelector('.event__save-btn').textContent = 'Save';
    this._enableForm();
  }

  _disableForm() {
    this.getElement().querySelectorAll('input')
      .forEach((input) => input.disabled = true);
    this.getElement().querySelector('.event__save-btn').disabled = true;

    if(!this._isNewPoint) {
      this.getElement().querySelector('.event__reset-btn').disabled = true;
    }
  }

  _enableForm() {
    this.getElement().querySelectorAll('input')
      .forEach((input) => input.disabled = false);
    this.getElement().querySelector('.event__save-btn').disabled = false;

    if(!this._isNewPoint) {
      this.getElement().querySelector('.event__reset-btn').disabled = false;
    }
  }

  _removeError() {
    this.getElement().classList.remove('shake');
    this._enableForm();
  }

  _showError() {
    this.getElement().classList.add('shake');
    this._disableForm();
    setTimeout(this._removeError, 1000);
  }

  _setDatePicker() {
    if (this._datePickerFrom || this._datePickerTo) {
      this._datePickerFrom.destroy();
      this._datePickerTo.destroy();
    }

    const pickerConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      closeOnSelect: false,
      'time_24hr': true,
    };

    this._datePickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        ...pickerConfig,
        defaultDate: this._state.dateFrom,
        onClose: this._dateFromChangeHandler,
      },
    );

    this._datePickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        ...pickerConfig,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this._dateToChangeHandler,
      },
    );
  }

  _setInnerEventHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);

    const availableOffers = this.getElement()
      .querySelector('.event__available-offers');

    if (availableOffers) {
      availableOffers.addEventListener('change', this._offersChangeHandler);
    }
  }

  _convertPointDataToState(point) {
    const { offers, type, destination } = point;
    const { description, pictures, name } = destination;

    const offersWithId = this._offersData[type]
      .map((offer) => ({
        ...offer,
        isChecked: offers.some(({title, price}) =>
          offer.title === title && offer.price === price),
        id: nanoid(),
      }));

    return {
      ...point,
      offers: offersWithId,
      hasOffers: offersWithId.length !== 0,
      hasDescription: description.length !== 0,
      hasPictures: pictures.length !== 0,
      hasCityName: name.length !== 0,
      hasBasePrice: true,
    };
  }

  _convertStateToPointData() {
    delete this._state.hasDescription;
    delete this._state.hasPictures;
    delete this._state.hasOffers;
    delete this._state.hasBasePrice;
    delete this._state.hasCityName;

    this._state.offers = this._state.offers.filter((offer) => offer.isChecked);
    this._state.offers.forEach((offer) => {
      delete offer.id;
      delete offer.isChecked;
    });

    return this._state;
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

  _priceChangeHandler({ target }) {
    const value = target.value;

    const update = {
      hasBasePrice: false,
    };

    if (value.length !== 0 && NUMBER_PATTERN.test(value)) {
      update.hasBasePrice = true;
      update.basePrice = +value;
    } else {
      update.basePrice = value;
    }

    this.updateState(update);
  }

  _rollUpClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickRollUpButton();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submitForm(
      this._convertStateToPointData(this._state),
      {
        showPending: this._showSaving,
        hidePending: this._hideSaving,
        showError: this._showError,
      },
    );
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickDelete(
      this._convertStateToPointData(this._state),
      {
        showPending: this._showDeleting,
        hidePending: this._hideDeleting,
        showError: this._showError,
      },
    );
  }

  _typeChangeHandler({ target }) {
    const offers = this._offersData[target.value].map((offer) => ({
      ...offer,
      isChecked: false,
      id: nanoid(),
    }));

    const updatedState = {
      offers,
      hasOffers: offers.length !== 0,
      type: target.value,
    };

    this.updateState(updatedState);
    target.checked = false;
  }

  _offersChangeHandler({ target }) {
    if (target.tagName === 'INPUT') {
      const offers = this._state
        .offers
        .slice()
        .map((offer) => {
          if(offer.id === target.id) {
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

  _cityNameChangeHandler({ target }) {
    const cityName = target.value;

    if (this._cityNamesData.includes(cityName)) {
      const destination = this._destinationsData
        .filter(({ name }) => name === cityName)[0];
      const { description, pictures } = destination;

      const updatedState = {
        destination,
        hasDescription: description.length !== 0,
        hasPictures: pictures.length !== 0,
        hasCityName: true,
      };

      this.updateState(updatedState);
    } else {
      this.updateState({
        destination: {
          name: '',
        },
        hasDescription: false,
        hasPictures: false,
        hasCityName: false,
      });
    }
  }
}

export default EditForm;
