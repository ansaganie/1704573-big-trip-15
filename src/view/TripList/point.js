import AbstractView from '../abstract.js';
import { formatDate, calculateDiff, formatDuration } from '../../utils/date.js';
import { capitalize } from 'lodash';
import he from 'he';

const createOfferTemplate = ({ title, price }) => (
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    +€&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`
);

const createEventScheduleTemplate = (dateFrom, dateTo) =>
  `<div class="event__schedule">
    <p class="event__time">
      <time
        class="event__start-time"
        datetime="${dateFrom}">
          ${formatDate(dateFrom, 'hh:mm')}
      </time>
      —
      <time
      class="event__end-time"
      datetime="${dateTo}">
        ${formatDate(dateTo, 'hh:mm')}
      </time>
    </p>
    <p class="event__duration">
      ${formatDuration(calculateDiff(dateTo, dateFrom))}
    </p>
  </div>`;

const createEventItem = ({
  type,
  dateFrom,
  dateTo,
  basePrice,
  offers,
  destination,
  isFavorite,
}) => {
  const offersFragment = offers
    .map((offer) => createOfferTemplate(offer))
    .join('\n');

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time
          class="event__date"
          datetime="${formatDate(dateFrom, 'yyyy-mm-dd')}">
            ${formatDate(dateFrom, 'MMM DD')}
        </time>
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${type}.png"
            alt="Event type icon"
          >
        </div>
        <h3 class="event__title">
          ${capitalize(type)} ${destination.name}
        </h3>
        ${createEventScheduleTemplate(dateFrom, dateTo)}
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersFragment}
        </ul>
        <button
          class="
            event__favorite-btn
            ${isFavorite ? 'event__favorite-btn--active' : ''}"
          type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

class Point extends AbstractView{
  constructor(point) {
    super();

    this._point = point;

    this._rollDownClickHandler = this._rollDownClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._showFavoriteButtonPending = this._showFavoriteButtonPending.bind(this);
    this._hideFavoriteButtonPending = this._hideFavoriteButtonPending.bind(this);
  }

  getTemplate() {
    return createEventItem(this._point);
  }

  setRollDownClickHandler(handler) {
    this._callback.clickRollDown = handler;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollDownClickHandler);
  }

  setFavoriteClickHandler(handler) {
    this._callback.clickFavorite = handler;
    this
      .getElement()
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._favoriteClickHandler);
  }

  _disableFavoriteButton() {
    this.getElement()
      .querySelector('.event__favorite-btn')
      .disabled = true;
  }

  _enableFavoriteButton() {
    this.getElement()
      .querySelector('.event__favorite-btn')
      .disabled = false;
  }

  _showFavoriteButtonPending() {
    this._disableFavoriteButton();
    document.body.style.cursor = 'wait';
    this.getElement()
      .querySelector('.event__favorite-btn')
      .style.cursor = 'wait';
  }

  _hideFavoriteButtonPending() {
    this._enableFavoriteButton();
    document.body.style.cursor = 'auto';
    this.getElement()
      .querySelector('.event__favorite-btn')
      .style.cursor = 'auto';
  }

  _rollDownClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickRollDown();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorite({
      showPending: this._showFavoriteButtonPending,
      hidePending: this._hideFavoriteButtonPending,
      showError: function() {},
    });
  }
}

export default Point;
