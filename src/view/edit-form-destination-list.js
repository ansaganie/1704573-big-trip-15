export const createEditFormDestinationList = (cityNames) => {
  let result = '';
  if (cityNames) {
    cityNames.forEach(
      (cityName) => result = `${result}<option value="${cityName}"></option>`,
    );
  }
  return `
  <datalist id="destination-list-1">
    ${result}
  </datalist>`;
};
