const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuType = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

const OfflineErrorMessage = {
  CREATE: 'You can not create new point offline',
  UPDATE: 'You can not update point offline',
  DELETE: 'You can not delete point offline',
  ADD: 'You can not add new point offline',
};

const CssClassNames = {
  NEW_POINT_BUTTON: '.trip-main__event-add-btn',
  HEADER_CONTAINER: '.page-body__container.page-header__container',
  INFO_CONTAINER: '.trip-main',
  MENU_CONTAINER: '.trip-controls__navigation',
  FILTER_CONTAINER: '.trip-controls__filters',
  MAIN_CONTAINER: 'main .page-body__container',
  TRIP_CONTAINER:'.trip-events',
  FILTER: '.trip-filters__filter-input',
  HIDE_AFTER: 'hide-after',
  GREEN_TEXT: 'green',
};

export {
  UserAction,
  UpdateType,
  FilterType,
  MenuType,
  OfflineErrorMessage,
  CssClassNames
};
