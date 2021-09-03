class PointsAdapter {
  static adaptServerToClient(unit) {
    const adaptedUnit = {
      ...unit,
      basePrice: unit['base_price'],
      dateFrom: new Date(unit['date_from']),
      dateTo: new Date(unit['date_to']),
      isFavorite: unit['is_favorite'],
    };

    adaptedUnit.offers.forEach((offer) => offer.isChecked = true);

    delete adaptedUnit['base_price'];
    delete adaptedUnit['date_from'];
    delete adaptedUnit['date_to'];
    delete adaptedUnit['is_favorite'];

    return adaptedUnit;
  }

  static adaptClientToServer(unit) {
    const adaptedUnit = {
      ...unit,
      'base_price': unit.basePrice,
      'date_from': unit.dateFrom.toISOString(),
      'date_to': unit.dateTo.toISOString(),
      'is_favorite': unit.isFavorite,
    };

    delete adaptedUnit.basePrice;
    delete adaptedUnit.dateFrom;
    delete adaptedUnit.dateTo;
    delete adaptedUnit.isFavorite;

    return adaptedUnit;
  }
}

export default PointsAdapter;
