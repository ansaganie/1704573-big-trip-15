import AbstractView from '../abstract.js';

const createImgTemplate = (picture) => (
  `<img
    class="event__photo"
    src="${picture.src}"
    alt="${picture.description}">`
);

const createPicturesTemplate = (pictures) => {
  const picturesOfDestination = pictures.map(createImgTemplate).join('');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesOfDestination}
      </div>
    </div>`
  );
};

const createDestinationTemplate = ({ description, pictures }, hasDescription = false, hasPictures = false) => {
  const picturesTemplate = hasPictures === true ? createPicturesTemplate(pictures) : '' ;
  const descriptionTemplate = hasDescription === true
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
