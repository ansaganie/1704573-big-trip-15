import AbstractView from './abstract.js';
import { createTripInfoDate } from '../utils/date.js';

const createTripInfoTemplate = (hasData, title, date, cost) => (
  !hasData
    ? ''
    : `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${date}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
      </section>`
);

class TripInfo extends AbstractView{
  constructor(events) {
    super();
    if (events.length > 0) {
      this._hasData = true;
      this._title = events
        .map(({ destination }) => destination.name)
        .join(' &mdash; ');

      this._cost = events
        .map(({ basePrice }) => basePrice)
        .reduce((acc, price) => acc + price);

      const startDate = events[0].dateFrom;
      const endDate = events[events.length - 1].dateTo;

      this._date =  createTripInfoDate(startDate, endDate);
    } else {
      this._hasData = false;
    }
  }

  getTemplate() {
    return createTripInfoTemplate(
      this._hasData,
      this._title,
      this._date,
      this._cost,
    );
  }
}

export default TripInfo;
