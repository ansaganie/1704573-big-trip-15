import OffersAdapter from './offers-adapter.js';
import PointsAdapter from './points-adapter.js';
import { HttpMethod, EndPoints } from '../utils/const.js';

class Api {
  constructor(mainUrl, authKey) {
    this._mainUrl = mainUrl;
    this._authKey = authKey;
  }

  addPoint(point) {
    return this._load({
      endPoint: EndPoints.POINTS,
      method: HttpMethod.POST,
      body: JSON.stringify(PointsAdapter.adaptClientToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointsAdapter.adaptServerToClient);
  }

  getPoints() {
    return this._load({
      endPoint: EndPoints.POINTS,
    })
      .then(Api.toJSON)
      .then((points) =>
        points.map((point) => PointsAdapter.adaptServerToClient(point)),
      );
  }

  updatePoint(point) {
    return this._load({
      endPoint: `${EndPoints.POINTS}/${point.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(PointsAdapter.adaptClientToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointsAdapter.adaptServerToClient);
  }

  deletePoint(point) {
    return this._load({
      endPoint: `${EndPoints.POINTS}/${point.id}`,
      method: HttpMethod.DELETE,
    });
  }

  getOffers() {
    return this._load({
      endPoint: EndPoints.OFFERS,
    })
      .then(Api.toJSON)
      .then(OffersAdapter.adaptServerToClient);
  }

  getDestinations() {
    return this._load({
      endPoint: EndPoints.DESTINATIONS,
    }).then(Api.toJSON);
  }

  _load({
    endPoint,
    method = HttpMethod.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authKey);

    return fetch(`${this._mainUrl}/${endPoint}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.ok === false) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export default Api;
