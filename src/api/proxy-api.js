import { isOnline } from '../utils/common.js';
import PointsAdapter from './points-adapter.js';

const ErrorMessage = {
  ADD: 'Can not add point in offline',
  SYNC: 'Data sync failed',
  DELETE: 'Can not delete point in offline',
};

class ProxyApi {
  constructor(api, pointsStorage, offersStorage, destinationsStorage) {
    this._api = api;
    this._pointsStorage = pointsStorage;
    this._offersStorage = offersStorage;
    this._destinationsStorage = destinationsStorage;

    this._needToSync = false;
  }

  getOffers() {
    const storedOffers = this._offersStorage.getItems();

    if (Object.keys(storedOffers).length === 0) {
      return this._api.getOffers().then((offers) => {
        this._offersStorage.setItems(offers);

        return offers;
      });
    }

    return Promise.resolve(storedOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations().then((destinations) => {
        this._destinationsStorage.setItems(destinations);

        return destinations;
      });
    }

    const storedDestinations = this._destinationsStorage.getItems();

    return Promise.resolve(storedDestinations);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point).then((newPoint) => {
        this._pointsStorage.setItem(
          newPoint.id,
          PointsAdapter.adaptClientToServer(newPoint),
        );

        return newPoint;
      });
    }

    return Promise.reject(new Error(ErrorMessage.ADD));
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints().then((points) => {
        const converted = ProxyApi.convertPointsToStorageStructure(
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
    if (isOnline()) {
      return this._api.updatePoint(point).then((updatedPoint) => {
        this._pointsStorage.setItem(
          point.id,
          PointsAdapter.adaptClientToServer(point),
        );

        return updatedPoint;
      });
    }

    this._pointsStorage.setItem(point.id, {
      ...PointsAdapter.adaptClientToServer(point),
    });

    this._needToSync = true;

    return Promise.resolve(point);
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api
        .deletePoint(point)
        .then(() => this._pointsStorage.removeItem(point.id));
    }

    return Promise.reject(new Error(ErrorMessage.DELETE));
  }

  sync() {
    if (isOnline() && this._needToSync) {
      const points = Object.values(this._pointsStorage.getItems());

      return this._api.sync(points).then(({ created, updated }) => {
        const createdPoints = ProxyApi.getSyncedPoints(created);
        const updatedPoints = ProxyApi.getSyncedPoints(updated);

        const items = ProxyApi.convertPointsToStorageStructure([
          ...createdPoints,
          ...updatedPoints,
        ]);

        this._pointsStorage.setItems(items);
      });
    }

    return Promise.reject(new Error(ErrorMessage.SYNC));
  }

  static getSyncedPoints(points) {
    return points.map(({ success, payload }) => {
      if (success) {
        return payload.point;
      }
    });
  }

  static convertPointsToStorageStructure(points) {
    return points.reduce(
      (acc, point) => ({
        ...acc,
        [point.id]: point,
      }),
      {},
    );
  }
}

export default ProxyApi;
