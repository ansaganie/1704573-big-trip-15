import { showOrHide } from '../../utils/common.js';
import Abstract from '../../abstract.js';

const createOffers = (offers) => {
  const createIdForOffer = (input) => input.toLowerCase().replace(' ', '-');

  return offers
    .map(({ isChecked, title, price }) =>
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="${createIdForOffer(title)}" type="checkbox"
          name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="${createIdForOffer(title)}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`)
    .join('\n');
};

const createOffersTemplate = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers ${showOrHide(offers)}">
      ${createOffers(offers)}
    </div>
  </section>`
);

class Offers extends Abstract {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOffersTemplate(this._offers);
  }
}

export default Offers;
