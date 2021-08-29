import MenuView from '../view/trip-tabs.js';
import FilterView from '../view/trip-filters.js';
import InfoView from '../view/trip-info.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { MenuType, UpdateType } from '../utils/const.js';
import { createTripInfoDate } from '../utils/date.js';

class Header {
  constructor(
    filterContainer,
    menuContainer,
    infoContainer,
    pointsModel,
    filterModel,
    tripPresenter,
  ) {
    this._filterContainer = filterContainer;
    this._menuContainer = menuContainer;
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripPresenter = tripPresenter;

    this._filterComponent = null;
    this._menuComponent = null;
    this._infoComponent = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._handlePointsModelUpdate = this._handlePointsModelUpdate.bind(this);
  }

  init() {
    this._newPointButton = this._infoContainer.querySelector(
      '.trip-main__event-add-btn',
    );
    this._handleNewPointClick = this._handleNewPointClick.bind(this);
    this._newPointButton.addEventListener('click', this._handleNewPointClick);

    this._pointsModel.addObserver(this._handlePointsModelUpdate);
    this._renderHeader();
  }

  _handleNewPointClick(evt) {
    evt.preventDefault();
    this._newPointButton.disabled = true;
    this._handleNewPointFormClose = this._handleNewPointFormClose.bind(this);
    this._tripPresenter.createNewPoint(this._handleNewPointFormClose);
  }

  _handleNewPointFormClose() {
    this._newPointButton.disabled = false;
  }

  _sortByDate(first, second) {
    return new Date(first.dateFrom) - new Date(second.dateFrom);
  }

  _renderFilter() {
    remove(this._filterComponent);
    this._filterComponent = new FilterView(this._filterModel.getFilterType());
    this._filterComponent.setFilterTypeChangeHandler(
      this._filterTypeChangeHandler,
    );

    render(this._filterContainer, this._filterComponent);
  }

  _renderMenu() {
    this._menuComponent = new MenuView(MenuType.TABLE);
    render(this._menuContainer, this._menuComponent);
  }

  _renderInfo() {
    this._infoComponent = new InfoView(this._getInfo());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _clearInfo() {
    remove(this._infoComponent);
    this._infoComponent = null;
  }

  _renderHeader() {
    this._renderInfo();
    this._renderMenu();
    this._renderFilter();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._filterModel.getFilterType() === filterType) {
      return;
    }

    this._filterModel.setFilterType(UpdateType.MAJOR, filterType);
  }

  _handlePointsModelUpdate() {
    this._clearInfo();
    this._renderFilter();
    if (this._pointsModel.getPoints().length > 0) {
      this._renderInfo();
    }
  }

  _getInfo() {
    const points = this._pointsModel.getPoints().slice().sort(this._sortByDate);

    if (points.length > 0) {
      const startDate = points[0].dateFrom;
      const endDate = points[points.length - 1].dateTo;

      return {
        title: points
          .map(({ destination }) => destination.name)
          .join(' &mdash; '),
        cost: points
          .map(({ basePrice }) => basePrice)
          .reduce((acc, price) => acc + price),
        date: createTripInfoDate(startDate, endDate),
        hasInfo: true,
      };
    }

    return {
      hasInfo: false,
    };
  }
}

export default Header;
