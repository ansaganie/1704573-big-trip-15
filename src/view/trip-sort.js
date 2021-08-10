import { createElement, capitalize } from '../utils.js';

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];
const DISABLED = SORT_TYPES.reduce((obj, elem) => ({ ...obj, [elem]: '' }), {});
DISABLED['event'] = 'disabled';
DISABLED['offer'] = 'disabled';

const CHECKED = SORT_TYPES.reduce((obj, elem) => ({ ...obj, [elem]: '' }), {});
CHECKED['day'] = 'checked';

const createTripSortTemplate = () => {
  const sortTemplates = SORT_TYPES.map(
    (sortType) =>
      `<div class="trip-sort__item  trip-sort__item--${sortType}">
          <input
            id="sort-${sortType}"
            class="trip-sort__input  visually-hidden"
            type="radio" name="trip-sort"
            value="sort-${sortType}"
            ${CHECKED[sortType]}
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

class TripSort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripSort;
