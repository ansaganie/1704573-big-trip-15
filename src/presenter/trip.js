import SortView from '../view/trip-sort.js';
import TripListView from '../view/TripList/trip-list.js';
import NoPointView from '../view/TripList/message.js';
import PointPresenter from './point.js';
import { remove, render } from '../utils/render.js';
import { calculateDiff, isFuture, isPast } from '../utils/date.js';
import { UpdateType, UserAction, FilterType, SortType } from '../utils/const.js';

class Trip {
  constructor(
    tripListContainer,
    pointsModel,
    filterModel,
  ) {
    this._tripListContainer = tripListContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._sortComponent = null;
    this._noPointComponent = null;
    this._listComponent = new TripListView();

    this._currentFilter = 'everything';
    this._currentSortType = SortType.DAY;
    this._pointPresenters = new Map();

    this._handleViewUpdate = this._handleViewUpdate.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filters = {
      [FilterType.EVERYTHING]: () => true,
      [FilterType.FUTURE]: (point) => isFuture(point.dateTo),
      [FilterType.PAST]: (point) => isPast(point.dateTo),
    };
  }

  init() {
    this._pointsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);
    this._renderTrip();
  }

  _getPoints() {
    const points = this._pointsModel
      .getPoints()
      .slice()
      .filter(
        this._filters[this._filterModel.getFilterType()],
      );


    switch (this._currentSortType) {
      case SortType.DAY:
        return points.sort(this._sortByDate);

      case SortType.TIME:
        return points.sort(this._sortByTime);

      case SortType.PRICE:
        return points.sort(this._sortByPrice);
    }

    return points;
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _handleViewUpdate(userAction, updateType, update) {
    switch(userAction) {
      case UserAction.ADD_POINT:
        this._pointsModel.add(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this._pointsModel.update(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.delete(updateType, update);
        break;
    }
  }

  _handleModelUpdate(updateType, update) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._pointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this._clearTripList();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTripList({ resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(
      container,
      this._handleViewUpdate,
      this._handleModeChange,
    );

    this._pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  _renderNoPoint() {
    this._noPointComponent = new NoPointView(this._filterModel.getFilterType());

    render(this._tripListContainer, this._noPointComponent);
  }

  _sortByDate(first, second) {
    return new Date(first.dateFrom) - new Date(second.dateFrom);
  }

  _sortByTime(first, second) {
    return (
      calculateDiff(second.dateFrom, second.dateTo) -
      calculateDiff(first.dateFrom, first.dateTo)
    );
  }

  _sortByPrice(first, second) {
    return second.basePrice - first.basePrice;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTrip();
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripListContainer, this._sortComponent);
  }


  _clearTripList({ resetSortType = false } = {}) {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    remove(this._sortComponent);
    remove(this._noPointComponent);

    this._sortComponent = null;
    this._noPointComponent = null;

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoint();
    } else {
      this._renderSort();
      points.forEach(
        (point) => this._renderPoint(this._listComponent, point),
      );

      render(this._tripListContainer, this._listComponent);
    }
  }
}

export default Trip;
