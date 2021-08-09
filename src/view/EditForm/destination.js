import { createElement, showOrHide } from '../../utils.js';

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

class Destination {
  constructor(destination) {
    this._destination = destination;
    this._element = null;
  }

  getTemplate() {
    return createDestination(this._destination);
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

export default Destination;
