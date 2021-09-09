import AbstractStorage from '../utils/abstract-storage';

class PointsStorage extends AbstractStorage {
  constructor(key, storage) {
    super(key, storage);
  }

  setItem(key, item) {
    const items = this.getItems();

    this.setItems({
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

export default PointsStorage;
