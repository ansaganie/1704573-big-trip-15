import Abstract from '../../abstract.js';
import { formatDate } from '../../date.js';
import { capitalize } from '../../utils.js';

const createOfferTemplate = ({ title, price }) =>
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    +€&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;

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
      ${(dateTo - dateFrom) / 60000}M
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
            ${formatDate(dateFrom, 'MMM dd')}
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
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersFragment}
        </ul>
        <button
          class="
            event__favorite-btn
            event__favorite-btn${isFavorite ? '--active' : ''}"
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

class EventItem extends Abstract{
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventItem(this._event);
  }
}

export default EventItem;
