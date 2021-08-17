import Abstract from '../abstract.js';

const createTripCostTemplate = (cost = 0) =>
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;

class TripCost extends Abstract{
  constructor() {
    super();
  }

  setEvents(events) {
    this._cost = events
      .map(({ basePrice }) => basePrice)
      .reduce((acc, price) => acc + price);
  }

  getTemplate() {
    return this._cost ? createTripCostTemplate(this._cost) : '';
  }
}

export default TripCost;
