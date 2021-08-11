import { capitalize } from '../../utils.js';
import { CITY_NAMES } from '../../mock/event.js';
import { offers as offersMock } from '../../mock/offer.js';
import { formatDate } from '../../date.js';
import DestinationList from './destination-list.js';
import Destination from './destination.js';
import EventType from './event-type.js';
import Offers from './offer.js';
import Abstract from '../../abstract.js';

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

export const createEditFormTemplate = (event = BLANK_EVENT) => {
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

class EditForm extends Abstract{
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEditFormTemplate(this._event);
  }
}

export default EditForm;
