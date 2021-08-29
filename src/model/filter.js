import AbstractObserverable from '../utils/abstract-observerable';
import { FilterType } from '../utils/const';

class Filter extends AbstractObserverable {
  constructor() {
    super();

    this._currentFilterType = FilterType.EVERYTHING;
  }

  setFilterType(updateType, filterType) {
    this._currentFilterType = filterType;
    this._notifyAll(updateType);
  }

  getFilterType() {
    return this._currentFilterType;
  }
}

export default Filter;
