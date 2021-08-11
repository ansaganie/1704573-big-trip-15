import Abstract from '../../abstract.js';
import { showOrHide } from '../../utils.js';

const createDestination = (destination) => {
  const { description, pictures } = destination;
  const picturesOfDestination = pictures
    ? pictures
      .map(
        (picture) =>
          `<img
            class="event__photo"
            src="${picture.src}"
            alt="${picture.description}">`,
      )
      .join('\n')
    : '';

  return (
    `<section
      class="event__section
        event__section--destination
        ${showOrHide(destination)}"
    >
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description ${showOrHide(description)}">
        ${description}
      </p>
      <div class="event__photos-container ${showOrHide(description)}">
        <div class="event__photos-tape">
          ${picturesOfDestination}
        </div>
      </div>
    </section>`
  );
};

class Destination extends Abstract {
  constructor(destination) {
    super();
    this._destination = destination;
  }

  getTemplate() {
    return createDestination(this._destination);
  }
}

export default Destination;
