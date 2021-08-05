import { showOrHide } from '../utils/show-hide';

export const createEditFormDestination = (destination) => {
  const { description, pictures} = destination;
  let picturesOfDestination = '';

  if (pictures) {
    pictures.forEach((picture) => {
      picturesOfDestination = `${picturesOfDestination}
      <img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
  }

  return `
    <section class="event__section  event__section--destination ${showOrHide(destination)}">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description" ${showOrHide(description)}>${description}</p>
      <div class="event__photos-container ${showOrHide(description)}">
        <div class="event__photos-tape">
          ${picturesOfDestination}
        </div>
      </div>
    </section>`;
};
