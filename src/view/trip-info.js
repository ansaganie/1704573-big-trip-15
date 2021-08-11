import Abstract from '../abstract.js';

const createTripInfoTemplate = (title = '', date = '') =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>
  </section>`;

class TripInfo extends Abstract{
  constructor(title, date) {
    super();
    this._title = title;
    this._date = date;
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._date);
  }
}

export default TripInfo;
