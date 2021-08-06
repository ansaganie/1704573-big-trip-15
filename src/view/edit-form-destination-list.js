export const createEditFormDestinationList = (cityNames) => {
  const result = cityNames
    .map((cityName) => `<option value="${cityName}"></option>`)
    .join('\n');

  return (
    `<datalist id="destination-list-1">
      ${result}
    </datalist>`
  );
};
