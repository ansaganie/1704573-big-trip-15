class Destination {
  constructor () {
    this._destinations = null;
  }

  setDestination(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }
}

export default Destination;
