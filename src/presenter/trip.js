import SortView from '../view/trip-sort.js';
import TripListView from '../view/TripList/trip-list.js';
import MessageView from '../view/TripList/message.js';
import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';
import { filters } from '../utils/filters.js';
import { remove, render, replace } from '../utils/render.js';
import { sortByDate, sortByPrice, sortByTime } from '../utils/points-sort.js';
import {
  UpdateType,
  UserAction,
  FilterType,
  SortType,
  Messages
} from '../utils/const.js';


class Trip {
  constructor(
    tripListContainer,
    pointsModel,
    filterModel,
    offersModel,
    destinationsModel,
  ) {
    this._tripListContainer = tripListContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._newPointPresenter = null;
    this._userActionHandlers = {
      [UserAction.ADD_POINT]: (updateType, updatedPoint, pendings) => {
        this._pointsModel.add(updateType, updatedPoint, pendings);
      },
      [UserAction.UPDATE_POINT]: (updateType, updatedPoint, pendings) => {
        this._pointsModel.update(updateType, updatedPoint, pendings);
      },
      [UserAction.DELETE_POINT]: (updateType, updatedPoint, pendings) => {
        this._pointsModel.delete(updateType, updatedPoint, pendings);
      },
    };

    this._pointPresenters = new Map();
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._noPointComponent = null;
    this._loadingComponent = null;
    this._listComponent = new TripListView();

    this._handleNewPointFormClose = this._handleNewPointFormClose.bind(this);
    this._handleViewUpdate = this._handleViewUpdate.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);

    this._offersData = this._offersModel.getOffers();
    this._destinationsData =  this._destinationsModel.getDestinations();
    this._cityNamesData = this._destinationsData.map(({name}) => name);

    this._renderTrip();
  }

  createNewPoint(enableNewPointButton) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter = new NewPointPresenter(
      this._listComponent,
      this._offersData,
      this._cityNamesData,
      this._destinationsData,
      this._handleViewUpdate,
      this._handleModeChange,
      this._handleNewPointFormClose,
      enableNewPointButton,
    );

    this._newPointPresenter.init();

    if(!this._listComponent.parentElement) {
      replace( this._listComponent, this._noPointComponent);
    }
  }

  destroy() {
    this._clearTripList({
      resetSortType: true,
    });

    remove(this._listComponent);

    this._pointsModel.removeObserver(this._handleModelUpdate);
    this._filterModel.removeObserver(this._handleModelUpdate);

    this._filterModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  showLoading() {
    this._loadingComponent = new MessageView(Messages.LOADING);
    render(this._tripListContainer, this._loadingComponent);
  }

  hideLoading() {
    remove(this._loadingComponent);
    this._loadingComponent = null;
  }

  showServerError() {
    render(this._tripListContainer, new MessageView(Messages.SERVER_ERROR));
  }

  _getPoints() {
    const points = this._pointsModel.getPoints()
      .filter(filters[this._filterModel.getFilterType()]);

    switch (this._currentSortType) {
      case SortType.DAY:
        return points.sort(sortByDate);

      case SortType.TIME:
        return points.sort(sortByTime);

      case SortType.PRICE:
        return points.sort(sortByPrice);
    }

    return points;
  }

  _handleModeChange() {
    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _handleNewPointFormClose() {
    this._clearTripList();
    this._renderTrip();
  }

  _handleViewUpdate(userAction, updateType, updatedPoint, pendings) {
    this._userActionHandlers[userAction](
      updateType,
      updatedPoint,
      pendings,
    );
  }

  _handleModelUpdate(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters.get(update.id).init(update);
        break;

      case UpdateType.MINOR:
        this._clearTripList();
        this._renderTrip();
        break;

      case UpdateType.MAJOR:
        this._clearTripList({ resetSortType: true });
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripList();
    this._renderTrip();
  }

  _clearTripList({ resetSortType = false } = {}) {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._loadingComponent);

    this._sortComponent = null;
    this._noPointComponent = null;

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(
      container,
      this._offersData,
      this._cityNamesData,
      this._destinationsData,
      this._handleViewUpdate,
      this._handleModeChange,
    );

    this._pointPresenters.set(point.id, pointPresenter);

    pointPresenter.init(point);
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoint();
    } else {
      this._renderSort();
      points.forEach((point) => this._renderPoint(this._listComponent, point));

      render(this._tripListContainer, this._listComponent);
    }
  }

  _renderNoPoint() {
    this._noPointComponent = new MessageView(
      Messages[
        this._filterModel
          .getFilterType()
          .toUpperCase()
      ],
    );

    render(this._tripListContainer, this._noPointComponent);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripListContainer, this._sortComponent);
  }
}

export default Trip;
