import AbstractView from '../abstract';

const createMessageTemplate = (message) =>
  `<p class="trip-events__msg">${message}</p>`;

class Message extends AbstractView {
  constructor() {
    super();
    this._filterMessage = {
      everything: 'Click New Event to create your first point',
      past: 'There are no past events now',
      future: 'There are no future events now',
      loading: 'Loading...',
    };
  }

  setFilterType(filterType) {
    this._currentFilter = filterType;
  }

  getTemplate() {
    return this._currentFilter
      ? createMessageTemplate(
        this._filterMessage[this._currentFilter],
      )
      : '';
  }
}

export default Message;
