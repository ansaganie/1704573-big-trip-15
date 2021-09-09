import AbstractObservable from '../utils/abstract-observable';
import { FilterType } from '../utils/const';

class Filter extends AbstractObservable {
  constructor() {
    super();

    this._currentFilterType = FilterType.EVERYTHING;
  }

  getFilterType() {
    return this._currentFilterType;
  }

  setFilterType(updateType, filterType) {
    this._currentFilterType = filterType;
    this._notifyAll(updateType);
  }

}

export default Filter;
