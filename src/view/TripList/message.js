import { FILTER_MESSAGE } from '../../utils/const';
import AbstractView from '../abstract';

const createMessageTemplate = (message) =>
  `<p class="trip-events__msg">${message}</p>`;

class Message extends AbstractView {
  constructor(filterType) {
    super();
    this._currentFilter = filterType;
  }

  getTemplate() {
    return createMessageTemplate(
      FILTER_MESSAGE[this._currentFilter],
    );
  }
}

export default Message;
