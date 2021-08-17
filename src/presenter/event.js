import TripInfoView from '../view/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripCostView from '../view/trip-cost';
import TripFilterView from '../view/trip-filters.js';
import TripSortView from '../view/trip-sort.js';
import EventListView from '../view/EventList/event-list.js';
import NoEventView from '../view/EventList/message.js';
import PointPresenter from './point.js';
import { render, RenderPosition } from '../utils/render.js';

class Event {
  constructor(
    infoContainer,
    tabsContainer,
    filterContainer,
    tripListContainer,
  ) {
    this._infoContainer = infoContainer;
    this._tabsContainer = tabsContainer;
    this._filterContainer = filterContainer;
    this._tripListContainer = tripListContainer;

    this._listComponent = new EventListView();
    this._tabsComponent = new TripTabsView();
    this._filtersComponent = new TripFilterView();
    this._noEventComponent = new NoEventView();
    this._infoComponent = new TripInfoView();
    this._sortComponent = new TripSortView();
    this._costComponent = new TripCostView();

    this._currentFilter = 'everything';
  }

  init(eventItems) {
    this._eventItems = eventItems;
    this._renderEvent();
  }

  _renderPoint(container, event) {
    const pointPresenter = new PointPresenter(container);
    pointPresenter.init(event);
  }

  _renderTabs() {
    render(this._tabsContainer, this._tabsComponent);
  }

  _renderFilters() {
    render(this._filterContainer, this._filtersComponent);
  }

  _renderNoEvent() {
    this._noEventComponent.setFilterType(this._currentFilter);
    render(this._tripListContainer, this._noEventComponent);
  }

  _renderSort() {
    render(this._tripListContainer, this._sortComponent);
  }

  _renderInfo() {
    this._infoComponent.setEvents(this._eventItems);
    this._costComponent.setEvents(this._eventItems);
    render(this._infoComponent, this._costComponent);
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent() {
    this._renderTabs();
    this._renderFilters();

    if (this._eventItems.length === 0) {
      this._renderNoEvent();
    } else {
      this._renderInfo();
      this._renderSort();

      for (let i = 0; i < this._eventItems.length; i++) {
        this._renderPoint(this._listComponent, this._eventItems[i]);
      }

      render(this._tripListContainer, this._listComponent);
    }
  }
}

export default Event;
