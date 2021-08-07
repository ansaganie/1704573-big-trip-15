export const createOffer = ({title, price}) => (
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    +€&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`
);
