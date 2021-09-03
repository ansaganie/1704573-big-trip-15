import Api from '../api/api';
import AbstractObserverable from '../utils/abstract-observerable';

class Points extends AbstractObserverable {
  constructor(api) {
    super();
    this._points = [];
    this._api = api;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  update(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._api.updatePoint(updatedPoint)
      .then((point) => {
        this._points = [
          ...this._points.slice(0, index),
          point,
          ...this._points.slice(index + 1),
        ];

        this._notifyAll(updateType, point);
      })
      .catch(Api.catchError);
  }

  add(updateType, newPoint) {
    this._api.addPoint(newPoint)
      .then((point) => {
        this._points = [...this._points, point];
        this._notifyAll(updateType, newPoint);
      })
      .catch(Api.catchError);
  }

  delete(updateType, deletedPoint) {
    const index = this._points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._api.deletePoint(deletedPoint)
      .then(() => {
        this._points = [
          ...this._points.slice(0, index),
          ...this._points.slice(index + 1),
        ];

        this._notifyAll(updateType);
      })
      .catch(Api.catchError);
  }
}

export default Points;
