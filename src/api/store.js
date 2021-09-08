class Store {
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
    this._storage.setItem(this._key, JSON.stringify(items));
  }

  setItem(key, item) {
    const items = this.getItems();

    this._storage.setItem(this._key, {
      ...items,
      [key]: item,
    });
  }

  removeItem(key) {
    const items = this.getItems();

    delete items[key];

    this.setItems(items);
  }
}

export default Store;
