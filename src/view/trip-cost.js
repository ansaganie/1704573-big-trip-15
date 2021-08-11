import Abstract from '../abstract.js';

const createTripCostTemplate = (cost = 0) =>
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;

class TripCost extends Abstract{
  constructor(cost) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return createTripCostTemplate(this._cost);
  }
}

export default TripCost;
