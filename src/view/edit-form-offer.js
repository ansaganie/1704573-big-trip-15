import { showOrHide } from '../utils/show-hide';

const createOffers = (offers) => {
  let result = '';

  const createIdForOffer = (input) => input.toLowerCase().replace(' ', '-');
  if (offers) {
    offers.forEach(({ isChecked, title, price }) => {
      const id = createIdForOffer(title);
      result = `${result}
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="${id}" type="checkbox"
          name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>
      `;
    });
  }

  return result;
};

export const createEditFormOffers = (offers) => `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers ${showOrHide(offers)}">
      ${createOffers(offers)}
    </div>
  </section>
`;
