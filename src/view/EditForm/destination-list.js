import { createElement } from '../../utils.js';

const createDestinationListTemplate = (cityNames) => {
  const result = cityNames
    .map((cityName) => `<option value="${cityName}"></option>`)
    .join('\n');

  return (
    `<datalist id="destination-list-1">
      ${result}
    </datalist>`
  );
};

class DestinationList {
  constructor(cityNames) {
    this._cityNames = cityNames;
    this._element = null;
  }

  getTemplate() {
    return createDestinationListTemplate(this._cityNames);
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

export default DestinationList;
