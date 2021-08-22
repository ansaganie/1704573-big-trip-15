import Abstract from '../../abstract.js';

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

class CityNames extends Abstract {
  constructor(cityNames) {
    super();
    this._cityNames = cityNames;
  }

  getTemplate() {
    return createDestinationListTemplate(this._cityNames);
  }
}

export default CityNames;
