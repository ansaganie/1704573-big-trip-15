import Abstract from '../../abstract.js';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

class EventList extends Abstract{
  constructor() {
    super();
  }

  getTemplate() {
    return createEventListTemplate();
  }
}

export default EventList;
