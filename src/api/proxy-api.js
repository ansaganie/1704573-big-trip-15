import { isOnline } from '../utils/common.js';
import PointsAdapter from './points-adapter.js';

class ProxyApi {
  constructor(
    api,
    pointsStorage,
    offersStorage,
    destinationsStorage,
  ) {
    this._api = api;
    this._pointsStorage = pointsStorage;
    this._offersStorage = offersStorage;
    this._destinationsStorage = destinationsStorage;
  }

  getOffers() {
    const storedOffers = this._offersStorage.getItems();

    if (Object.keys(storedOffers).length === 0) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStorage.setItems(offers);

          return offers;
        });
    }

    return Promise.resolve(storedOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStorage.setItems(destinations);

          return destinations;
        });
    }

    const storedDestinations = this._destinationsStorage.getItems();

    return Promise.resolve(storedDestinations);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStorage.setItem(newPoint.id, PointsAdapter.adaptClientToServer(newPoint));

          return newPoint;
        });
    }

    return Promise.reject(new Error('Can not add point in offline'));
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const converted = this._convertPointsToStorageStructure(
            points.map(PointsAdapter.adaptClientToServer),
          );
          this._pointsStorage.setItems(converted);

          return points;
        });
    }

    const storedPoints = Object.values(this._pointsStorage.getItems());

    return Promise.resolve(storedPoints.map(PointsAdapter.adaptServerToClient));
  }

  updatePoint(point) {
    if(isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStorage.setItem(point.id, PointsAdapter.adaptClientToServer(point));

          return updatedPoint;
        });
    }

    this._pointsStorage.setItem(
      point.id,
      { ...PointsAdapter.adaptClientToServer(point) },
    );

    return Promise.resolve(point);
  }

  deletePoint(point) {
    this._api.deletePoint(point)
      .then(() => this._pointsStorage.removeItem(point.id));

    return Promise.reject(new Error('Can not delete point in offline'));
  }

  _convertPointsToStorageStructure(points) {
    return points.reduce((acc, point) => ({
      ...acc,
      [point.id]: point,
    }), {});
  }
}

export default ProxyApi;
