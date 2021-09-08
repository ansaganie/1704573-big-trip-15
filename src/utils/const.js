const NUMBER_PATTERN = /^\d+$/;

const Messages = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no past events now',
  PAST: 'There are no future events now',
  LOADING: 'Loading...',
  SERVER_ERROR: 'Something went wrong. </br> Please try to refresh the page',
};

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

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

const MenuType = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const EndPoints = {
  OFFERS: 'offers',
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  POINTS_SYNC: 'points/sync',
};

export {
  NUMBER_PATTERN,
  Messages,
  UserAction,
  UpdateType,
  FilterType,
  SortType,
  MenuType,
  HttpMethod,
  EndPoints
};
