import { capitalize } from '../utils/string';

const FILTER_TYPES = ['everything', 'future', 'past'];
const CHECKED = FILTER_TYPES.reduce(
  (obj, elem) => ({ ...obj, [elem]: '' }),
  {},
);
CHECKED['everything'] = 'checked';

export const createTripFilters = () => {
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
