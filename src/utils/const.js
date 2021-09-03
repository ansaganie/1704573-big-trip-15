const POINT_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const FILTER_MESSAGE = {
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  future: 'There are no future events now',
  loading: 'Loading...',
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

export {
  POINT_TYPE,
  FILTER_MESSAGE,
  UserAction,
  UpdateType,
  FilterType,
  SortType,
  MenuType
};

