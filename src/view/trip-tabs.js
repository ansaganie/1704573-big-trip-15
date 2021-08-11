import Abstract from '../abstract';

const createTripTabsTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`;

class TripTabs extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripTabsTemplate();
  }
}

export default TripTabs;
