const ServerNaming = {
  BASE_PRICE: 'base_price',
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  IS_FAVORITE: 'is_favorite',
};

class PointsAdapter {
  static adaptServerToClient(unit) {
    const adaptedUnit = {
      ...unit,
      basePrice: unit[ServerNaming.BASE_PRICE],
      dateFrom: new Date(unit[ServerNaming.DATE_FROM]),
      dateTo: new Date(unit[ServerNaming.DATE_TO]),
      isFavorite: unit[ServerNaming.IS_FAVORITE],
    };

    delete adaptedUnit[ServerNaming.BASE_PRICE];
    delete adaptedUnit[ServerNaming.DATE_FROM];
    delete adaptedUnit[ServerNaming.DATE_TO];
    delete adaptedUnit[ServerNaming.IS_FAVORITE];

    return adaptedUnit;
  }

  static adaptClientToServer(unit) {
    const adaptedUnit = {
      ...unit,
      [ServerNaming.BASE_PRICE]: unit.basePrice,
      [ServerNaming.DATE_FROM]: unit.dateFrom.toISOString(),
      [ServerNaming.DATE_TO]: unit.dateTo.toISOString(),
      [ServerNaming.IS_FAVORITE]: unit.isFavorite,
    };

    delete adaptedUnit.basePrice;
    delete adaptedUnit.dateFrom;
    delete adaptedUnit.dateTo;
    delete adaptedUnit.isFavorite;

    return adaptedUnit;
  }
}

export default PointsAdapter;
