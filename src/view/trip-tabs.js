import AbstractView from './abstract.js';

const createTripTabsTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`;

class TripTabs extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripTabsTemplate();
  }
}

export default TripTabs;
