const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const EndPoints = {
  OFFERS: 'offers',
  POINTS: 'points',
  DESTINATIONS: 'destinations',
};

class Api {
  constructor(mainUrl, authKey) {
    this._mainUrl = mainUrl;
    this._authKey = authKey;
  }

  getPoints() {
    return this._load({
      endPoint: EndPoints.POINTS,
    }).then(Api.toJSON);
  }

  getOffers() {
    return this._load({
      endPoint: EndPoints.OFFERS,
    }).then((Api.toJSON));
  }

  getDestinations() {
    return this._load({
      endPoint: EndPoints.DESTINATIONS,
    }).then(Api.toJSON);
  }

  _load({
    endPoint,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authKey);

    return fetch(
      `${this._mainUrl}/${endPoint}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
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
