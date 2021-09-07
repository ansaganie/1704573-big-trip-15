import AbstractObservable from '../utils/abstract-observable';

class Points extends AbstractObservable {
  constructor(api) {
    super();

    this._points = [];
    this._api = api;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  add(updateType, newPoint, pendings) {
    const { showPending, hidePending, showError, closeForm } = pendings;

    showPending();


    this._api.addPoint(newPoint)
      .then((point) => {
        this._points = [...this._points, point];

        hidePending();

        if (closeForm) {
          closeForm();
        }

        this._notifyAll(updateType, newPoint);
      })
      .catch((err) => {
        hidePending();

        if (closeForm) {
          closeForm();
        }

        showError();
        throw err;
      });
  }

  getPoints() {
    return this._points;
  }

  update(updateType, updatedPoint, pendings) {
    const { showPending, hidePending, showError, closeForm } = pendings;

    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update nonexistent point');
    }

    showPending();


    this._api.updatePoint(updatedPoint)
      .then((point) => {
        this._points = [
          ...this._points.slice(0, index),
          point,
          ...this._points.slice(index + 1),
        ];

        hidePending();

        if (closeForm) {
          closeForm();
        }

        this._notifyAll(updateType, point);
      })
      .catch((err) => {
        hidePending();

        if (closeForm) {
          closeForm();
        }

        showError();
        throw err;
      });
  }


  delete(updateType, deletedPoint, pendings) {
    const { showPending, hidePending, showError, closeForm } = pendings;

    const index = this._points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete nonexistent point');
    }

    showPending();

    this._api.deletePoint(deletedPoint)
      .then(() => {
        this._points = [
          ...this._points.slice(0, index),
          ...this._points.slice(index + 1),
        ];

        hidePending();

        if (closeForm) {
          closeForm();
        }

        this._notifyAll(updateType);
      })
      .catch((err) => {
        hidePending();

        if (closeForm) {
          closeForm();
        }

        showError();
        throw err;
      });
  }
}

export default Points;
