import AbstractView from './abstract.js';
import { capitalize } from 'lodash';

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];
const DISABLED = SORT_TYPES.reduce((obj, elem) => ({ ...obj, [elem]: '' }), {});
DISABLED['event'] = 'disabled';
DISABLED['offer'] = 'disabled';

const createTripSortTemplate = (currentSortType) => {
  const sortTemplates = SORT_TYPES.map(
    (sortType) =>
      `<div class="trip-sort__item  trip-sort__item--${sortType}">
          <input
            id="sort-${sortType}"
            class="trip-sort__input  visually-hidden"
            type="radio" name="trip-sort"
            value="sort-${sortType}"
            ${`sort-${sortType}` === currentSortType ? 'checked' : ''}
            ${DISABLED[sortType]}>
          <label
            class="trip-sort__btn"
            for="sort-${sortType}">
              ${capitalize(sortType)}
          </label>
        </div>`,
  ).join('\n');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTemplates}
    </form>`
  );
};

class TripSort extends AbstractView {
  constructor(sortType) {
    super();
    this._currentSortType = sortType;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  _onSortTypeChange(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.changeSort(evt.target.id);
  }

  setSortTypeChangeHandler(handler) {
    this._callback.changeSort = handler;
    this.getElement()
      .addEventListener('click', this._onSortTypeChange);
  }

  getTemplate() {
    return createTripSortTemplate(this._currentSortType);
  }
}

export default TripSort;
