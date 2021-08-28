import AbstractView from './abstract.js';

const createTripInfoTemplate = ({ hasInfo = false, title, date, cost }) => (
  hasInfo === true
    ? `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${title}</h1>
          <p class="trip-info__dates">${date}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
      </section>`
    : ''
);

class TripInfo extends AbstractView{
  constructor(info) {
    super();

    this._info = info;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
  }
}

export default TripInfo;
