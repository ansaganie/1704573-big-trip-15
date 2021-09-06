import { capitalize } from 'lodash';
import AbstractView from '../abstract.js';

export const createEventTypeTemplate = (type, types) => {
  const CHECKED = types.reduce(
    (obj, elem) => ({...obj, [elem]: ''}),
    {},
  );

  CHECKED[type] = 'checked';

  const eventTypeItems = types
    .map((point) =>
      `<div class="event__type-item">
        <input
          id="event-type-${point}-1"
          class="event__type-input  visually-hidden"
          type="radio" name="event-type"
          value="${point}" ${CHECKED[point]}>
        <label
          class="event__type-label  event__type-label--${point}"
          for="event-type-${point}-1"
        >${capitalize(point)}</label>
      </div>`)
    .join('\n');

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventTypeItems}
        </fieldset>
      </div>
    </div>`
  );
};

class EventType extends AbstractView {
  constructor(type, types) {
    super();
    this._type = type;
    this._types = types;
  }

  getTemplate() {
    return createEventTypeTemplate(this._type, this._types);
  }
}

export default EventType;
