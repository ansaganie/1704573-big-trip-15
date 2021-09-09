import { isEqual } from 'lodash';

class AbstractStorage {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._key)) || {};
    } catch (error) {
      return {};
    }
  }

  setItems(items) {
    const storageValue = this._storage.getItem(this._key);
    const serialized = JSON.stringify(items);

    if (isEqual(storageValue, serialized)) {
      this._storage.setItem(this._key, serialized);
    }
  }
}

export default AbstractStorage;
