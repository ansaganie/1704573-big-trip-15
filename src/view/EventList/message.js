import Abstract from '../../abstract';

const createMessageTemplate = (message) =>
  `<p class="trip-events__msg">${message}</p>`;

class Message extends Abstract {
  constructor(currentFilter) {
    super();
    this._filterMessage = {
      everything: 'Click New Event to create your first point',
      past: 'There are no past events now',
      future: 'There are no future events now',
      loading: 'Loading...',
    };
    this._currentFilter = currentFilter;
  }

  getTemplate() {
    return createMessageTemplate(
      this._filterMessage[this._currentFilter],
    );
  }
}

export default Message;
