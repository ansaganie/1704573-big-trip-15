import TripSortView from '../view/trip-sort.js';
import EventListView from '../view/EventList/event-list.js';
import NoEventView from '../view/EventList/message.js';
import PointPresenter from './point.js';
import { render } from '../utils/render.js';
import { updateArray } from '../utils/common.js';
import { calculateDuration } from '../utils/date.js';

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

class Event {
  constructor(
    tripListContainer,
  ) {
    this._tripListContainer = tripListContainer;

    this._listComponent = new EventListView();
    this._noEventComponent = new NoEventView();
    this._sortComponent = new TripSortView();

    this._currentFilter = 'everything';
    this._currentSortType = SortType.DAY;
    this._pointPresenters = new Map();

    this._updatePointsData = this._updatePointsData.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(pointsData) {
    this._pointsData = pointsData.slice();
    this._sortPoints(this._currentSortType);
    this._renderEvent();
  }

  _clearEvent() {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _updatePointsData(updatedPoint) {
    this._pointsData = updateArray(this._pointsData, updatedPoint);
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  _renderPoint(container, event) {
    const pointPresenter = new PointPresenter(
      container,
      this._updatePointsData,
      this._handleModeChange,
    );

    this._pointPresenters.set(event.id, pointPresenter);
    pointPresenter.init(event);
  }

  _renderNoEvent() {
    this._noEventComponent.setFilterType(this._currentFilter);

    render(this._tripListContainer, this._noEventComponent);
  }

  _sortByDate(first, second) {
    return new Date(first.dateFrom) - new Date(second.dateFrom);
  }

  _sortByTime(first, second) {
    return (
      calculateDuration(second.dateFrom, second.dateTo) -
      calculateDuration(first.dateFrom, first.dateTo)
    );
  }

  _sortByPrice(first, second) {
    return second.basePrice - first.basePrice;
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._pointsData.sort(this._sortByDate);
        this._currentSortType = SortType.DAY;
        break;

      case SortType.TIME:
        this._pointsData.sort(this._sortByTime);
        this._currentSortType = SortType.TIME;
        break;

      case SortType.PRICE:
        this._pointsData.sort(this._sortByPrice);
        this._currentSortType = SortType.PRICE;
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearEvent();
    this._renderEvent();
  }

  _renderSort() {
    render(this._tripListContainer, this._sortComponent);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent() {
    if (this._pointsData.length === 0) {
      this._renderNoEvent();
    } else {
      this._renderSort();
      this._pointsData.forEach(
        (item) => this._renderPoint(this._listComponent, item),
      );

      render(this._tripListContainer, this._listComponent);
    }
  }
}

export default Event;
