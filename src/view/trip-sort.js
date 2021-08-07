import { capitalize } from '../utils/string';

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];
const DISABLED = SORT_TYPES.reduce((obj, elem) => ({ ...obj, [elem]: '' }), {});
DISABLED['event'] = 'disabled';
DISABLED['offer'] = 'disabled';

const CHECKED = SORT_TYPES.reduce((obj, elem) => ({ ...obj, [elem]: '' }), {});
CHECKED['day'] = 'checked';

export const createTripSort = () => {
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
