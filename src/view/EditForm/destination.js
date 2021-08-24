import AbstractView from '../abstract.js';

const createPicturesTemplate = (pictures) => {
  const picturesOfDestination = pictures
    .map(
      (picture) =>
        `<img
          class="event__photo"
          src="${picture.src}"
          alt="${picture.description}">`,
    )
    .join('\n');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesOfDestination}
      </div>
    </div>`
  );
};

const createDestinationTemplate = (destination, hasDescription, hasPictures) => {
  const { description, pictures } = destination;
  const picturesTemplate = hasPictures ? createPicturesTemplate(pictures) : '' ;
  const descriptionTemplate = hasDescription
    ? `<p class="event__destination-description">${description}</p>` : '';

  return (
    `<section class="event__section event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionTemplate}
      ${picturesTemplate}
    </section>`
  );
};

class Destination extends AbstractView {
  constructor(destination, hasDescription, hasPictures) {
    super();
    this._destination = destination;
    this._hasDescription = hasDescription;
    this._hasPictures = hasPictures;
  }

  getTemplate() {
    return createDestinationTemplate(
      this._destination,
      this._hasDescription,
      this._hasPictures,
    );
  }
}

export default Destination;
