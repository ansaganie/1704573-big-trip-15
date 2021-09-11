import AbstractView from '../abstract.js';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

class TripList extends AbstractView{
  constructor() {
    super();
  }

  getTemplate() {
    return createEventListTemplate();
  }
}

export default TripList;
