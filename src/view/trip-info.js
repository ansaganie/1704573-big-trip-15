import { createElement } from '../utils.js';

const createTripInfoTemplate = (title = '', date = '') =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>
  </section>`;

class TripInfo {
  constructor(title, date) {
    this._title = title;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripInfo;
