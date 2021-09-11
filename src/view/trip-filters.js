import { capitalize } from 'lodash';
import { FilterType } from '../utils/const.js';
import AbstractView from './abstract.js';

const createTripFiltersTemplate = (currentFilterType, filtersAvailability) => {

  const filterTemplates = Object.values(FilterType).map(
    (filterType) =>
      `<div class="trip-filters__filter">
        <input
          id="filter-${filterType}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio" name="trip-filter"
          value="${filterType}"
          ${filterType === currentFilterType ? 'checked' : ''}
          ${filtersAvailability[filterType] ? '' : 'disabled'}
          >
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

class TripFilters extends AbstractView {
  constructor(filterType, filtersAvailability) {
    super();

    this._currentFilterType = filterType;
    this._filtersAvailability = filtersAvailability;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(
      this._currentFilterType,
      this._filtersAvailability,
    );
  }

  setFilterTypeChangeHandler(handler) {
    this._callback.changeFilterType = handler;
    this.getElement()
      .addEventListener('change', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler({ target }) {
    this._callback.changeFilterType(target.value);
  }
}

export default TripFilters;
