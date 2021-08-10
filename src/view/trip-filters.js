import { createElement, capitalize } from '../utils.js';

const FILTER_TYPES = ['everything', 'future', 'past'];
const CHECKED = FILTER_TYPES.reduce(
  (obj, elem) => ({ ...obj, [elem]: '' }),
  {},
);
CHECKED['everything'] = 'checked';

const createTripFiltersTemplate = () => {
  const filterTemplates = FILTER_TYPES.map(
    (filterType) =>
      `<div class="trip-filters__filter">
          <input
            id="filter-${filterType}"
            class="trip-filters__filter-input  visually-hidden"
            type="radio" name="trip-filter"
            value="${filterType}"
            ${CHECKED[filterType]}>
          <label
            class="trip-filters__filter-label"
            for="filter-${filterType}">
            ${capitalize(filterType)}
          </label>
        </div>`,
  ).join('\n');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterTemplates}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

class TripFilter {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripFiltersTemplate();
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

export default TripFilter;
