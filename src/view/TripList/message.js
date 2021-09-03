import AbstractView from '../abstract';

const createMessageTemplate = (message) =>
  `<p class="trip-events__msg">${message}</p>`;

class Message extends AbstractView {
  constructor(message) {
    super();
    this._currentMessage = message;
  }

  getTemplate() {
    return createMessageTemplate(this._currentMessage);
  }
}

export default Message;
