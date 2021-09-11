import AbstractView from '../abstract.js';

const createOfferTemplate = ({ id, isChecked, title, price }) => (
  `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="${id}" type="checkbox"
        name="${id}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
);

const createOffersTemplate = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map(createOfferTemplate).join('')}
    </div>
  </section>`
);

class Offers extends AbstractView {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOffersTemplate(this._offers);
  }
}

export default Offers;
