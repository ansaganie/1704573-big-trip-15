import { createOffer } from './event-item-offer';
import { formatDate } from '../utils/date';

export const createEventItem = ({
  type,
  dateFrom,
  dateTo,
  basePrice,
  offers,
  destination,
}) => {
  const offersFragment = [];
  offers.forEach((offer) => offersFragment.push(createOffer(offer)));

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatDate(dateFrom, 'yyyy-mm-dd')}">${formatDate(dateFrom, 'MMM dd')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type.charAt(0).toUpperCase() + type.slice(1)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${formatDate(dateFrom, 'hh:mm')}</time>
          —
          <time class="event__end-time" datetime="${dateTo}">${formatDate(dateTo, 'hh:mm')}</time>
        </p>
        <p class="event__duration">${(dateTo - dateFrom)/60000}M</p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersFragment.join('')}
      </ul>
      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
