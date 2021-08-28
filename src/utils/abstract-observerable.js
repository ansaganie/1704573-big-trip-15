class AbstractObserverable {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notifyAll(updateType, update) {
    this._observers.forEach((observer) => observer(updateType, update));
  }
}

export default AbstractObserverable;
