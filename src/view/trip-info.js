import Abstract from '../abstract.js';
import { createTripInfoDate } from '../utils/date.js';

const createTripInfoTemplate = (title = '', date = '') =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>
  </section>`;

class TripInfo extends Abstract{
  constructor(events) {
    super();

    this._title = events
      .map(({ destination }) => destination.name)
      .join(' &mdash; ');

    const startDate = events[0].dateFrom;
    const endDate = events[events.length - 1].dateTo;
    this._date =  createTripInfoDate(startDate, endDate);
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._date);
  }
}

export default TripInfo;
