import MenuView from '../view/trip-tabs.js';
import FilterView from '../view/trip-filters.js';
import InfoView from '../view/trip-info.js';
import StatsView from '../view/statistics.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { createTripInfoDate } from '../utils/date.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';
import { filters } from '../utils/filters.js';
import { sortByDate } from '../utils/points-sort.js';
import {
  CssClassNames,
  FilterType,
  MenuType,
  OfflineErrorMessage,
  UpdateType
} from '../utils/const.js';

const MAX_HEADER_LENGTH = 3;

class Header {
  constructor(
    mainContainer,
    filterContainer,
    menuContainer,
    infoContainer,
    pointsModel,
    filterModel,
    tripPresenter,
  ) {
    this._mainContainer = mainContainer;
    this._filterContainer = filterContainer;
    this._menuContainer = menuContainer;
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripPresenter = tripPresenter;

    this._newPointButton = this._infoContainer.querySelector(
      CssClassNames.NEW_POINT_BUTTON,
    );
    this._currentMenuType = MenuType.TABLE;
    this._headerContainer = document.querySelector(
      CssClassNames.HEADER_CONTAINER,
    );

    this._filterComponent = null;
    this._menuComponent = null;
    this._infoComponent = null;
    this._statsComponent = null;

    this._handleNewPointClick = this._handleNewPointClick.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handlePointsModelUpdate = this._handlePointsModelUpdate.bind(this);
    this._handleFilterModelUpdate = this._handleFilterModelUpdate.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._calculateTotalPrice = this._calculateTotalPrice.bind(this);
  }

  init() {
    this._newPointButton.addEventListener('click', this._handleNewPointClick);
    this._pointsModel.addObserver(this._handlePointsModelUpdate);
    this._filterModel.addObserver(this._handleFilterModelUpdate);

    this._renderHeader();
  }

  _renderFilter() {
    remove(this._filterComponent);

    const filtersAvailability = this._calculateFiltersAvailability();

    this._filterComponent = new FilterView(
      this._filterModel.getFilterType(),
      filtersAvailability,
    );
    this._filterComponent.setFilterTypeChangeHandler(
      this._handleFilterTypeChange,
    );

    render(this._filterContainer, this._filterComponent);
  }

  _renderMenu() {
    this._menuComponent = new MenuView(MenuType.TABLE);
    this._menuComponent.setMenuClickHandler(this._handleMenuClick);
    render(this._menuContainer, this._menuComponent);
  }

  _renderInfo() {
    this._infoComponent = new InfoView(this._getInfo());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderStats() {
    this._statsComponent = new StatsView(this._pointsModel.getPoints());
    render(this._mainContainer, this._statsComponent);
  }

  _renderHeader() {
    this._renderInfo();
    this._renderMenu();
    this._renderFilter();
  }

  _destroyStats() {
    remove(this._statsComponent);
    this._statsComponent = null;
  }

  _clearInfo() {
    if (
      this._infoComponent === null ||
      this._infoComponent.getElement() === null
    ) {
      return;
    }

    remove(this._infoComponent);
    this._infoComponent = null;
  }

  _calculateOffersTotalPrice(total, { price }) {
    return total + price;
  }

  _calculateTotalPrice(acc, { basePrice, offers }) {
    const offersTotalPrice = offers.reduce(
      this._calculateOffersTotalPrice,
      0,
    );

    return acc + basePrice + offersTotalPrice;
  }

  _getInfo() {
    const points = this._pointsModel.getPoints().slice().sort(sortByDate);

    if (points.length > 0) {
      const startDate = points[0].dateFrom;
      const endDate = points[points.length - 1].dateTo;

      let title;

      if (points.length > MAX_HEADER_LENGTH) {
        title = `${points[0].destination.name}
        &mdash; ... &mdash;
        ${points[points.length - 1].destination.name}`;
      } else {
        title = points
          .map(({ destination }) => destination.name)
          .join(' &mdash; ');
      }

      return {
        title,
        cost: points.reduce(this._calculateTotalPrice, 0),
        date: createTripInfoDate(startDate, endDate),
        hasInfo: true,
      };
    }

    return {
      hasInfo: false,
    };
  }

  _calculateFiltersAvailability() {
    const points = this._pointsModel.getPoints().slice();

    return {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.PAST]: points.filter(filters[FilterType.PAST]).length > 0,
      [FilterType.FUTURE]: points.filter(filters[FilterType.FUTURE]).length > 0,
    };
  }

  _handleMenuClick(menuType) {
    if (this._currentMenuType === menuType) {
      return;
    }

    this._currentMenuType = menuType;

    switch (menuType) {
      case MenuType.TABLE:
        this._destroyStats();
        this._tripPresenter.init();

        this._renderFilter();
        this._newPointButton.disabled = false;
        this._filterComponent.disabled = false;
        this._headerContainer.classList.remove(CssClassNames.HIDE_AFTER);
        this._mainContainer.classList.remove(CssClassNames.HIDE_AFTER);
        break;

      case MenuType.STATS:
        this._tripPresenter.destroy();
        this._renderStats();

        this._filterComponent
          .getElement()
          .querySelectorAll(CssClassNames.FILTER)
          .forEach((input) => (input.disabled = true));
        this._newPointButton.disabled = true;
        this._headerContainer.classList.add(CssClassNames.HIDE_AFTER);
        this._mainContainer.classList.add(CssClassNames.HIDE_AFTER);
        break;
    }
  }

  _handleNewPointClick(evt) {
    evt.preventDefault();

    if (!isOnline()) {
      toast(OfflineErrorMessage.CREATE);

      return;
    }

    this._newPointButton.disabled = true;
    this._handleNewPointFormClose = this._handleNewPointFormClose.bind(this);
    this._tripPresenter.createNewPoint(this._handleNewPointFormClose);
  }

  _handleNewPointFormClose() {
    this._newPointButton.disabled = false;
  }

  _handleFilterTypeChange(filterType) {
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

  _handleFilterModelUpdate() {
    this._renderFilter();
  }
}

export default Header;
