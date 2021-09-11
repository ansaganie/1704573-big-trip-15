import AbstractView from './abstract.js';
import { MenuType } from '../utils/const.js';
import { capitalize } from 'lodash';

const createTripTabsTemplate = (currentMenuType) => {
  const tabs = Object.values(MenuType).map((tab) => {
    const isActive = tab === currentMenuType ;

    return (
      `<a id="${tab}"
        class="trip-tabs__btn ${isActive ? 'trip-tabs__btn--active' : ''}"
        href="#">
        ${capitalize(tab)}
      </a>`
    );
  }).join('');

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${tabs}
    </nav>`
  );
};

class TripTabs extends AbstractView {
  constructor(menuType) {
    super();

    this._currentMenuType = menuType;
    this._activeTabClass = 'trip-tabs__btn--active';

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate(this._currentMenuType);
  }

  setMenuClickHandler(handler) {
    this._callback.clickMenu = handler;
    this.getElement()
      .addEventListener('click', this._menuClickHandler);
  }

  _activateTab(tab) {
    this.getElement()
      .querySelector(`.${this._activeTabClass}`)
      .classList
      .remove(this._activeTabClass);
    this.getElement()
      .querySelector(`#${tab}`)
      .classList
      .add(this._activeTabClass);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'A') {
      this._callback.clickMenu(evt.target.id);
      this._activateTab(evt.target.id);
    }
  }
}

export default TripTabs;
