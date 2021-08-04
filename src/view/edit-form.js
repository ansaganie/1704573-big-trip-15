import { offers as offersMock } from '../mock/offer';
import { formatDate } from '../utils/date';
import { capitalize } from '../utils/string';
import { createEditFromDestination } from './edit-form-destination';
import { createEditFormOffers } from './edit-form-offer';
import { createEditFormEventType } from './edit-form-event-type.js';

export const createEditForm = (event = {}) => {
  const {
    type = 'taxi',
    offers = offersMock[type],
    destination = {
      name: '',
      description: '',
      pictures: [],
    },
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
  } = event;
  const editFormOffers = createEditFormOffers(offers);
  const editFormDestination = createEditFromDestination(destination);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${createEditFormEventType()}
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, 'dd/mm/yy hh:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, 'dd/mm/yy hh:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${editFormOffers}
      ${editFormDestination}
    </section>
  </form>
</li>`;
};
