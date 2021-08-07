import { getDateTo, getRandomDateFrom } from '../utils/date';
import { getRandomInteger, getRandomElement } from '../utils/random';
import { getRandomDestination } from './destination';
import { offers } from './offer';

const MAX_PRICE = 300;
const MIN_PRICE = 5000;

const CITY_NAMES = [
  'Paris',
  'London',
  'Lisbon',
  'Oslo',
  'Helsinki',
  'Rio de Janeiro',
  'Tokio',
  'Berlin',
];

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

const generatePoint = () => {
  const type = getRandomElement(POINT_TYPE);
  const dateFrom = getRandomDateFrom();

  return {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: getRandomDestination(getRandomElement(CITY_NAMES)),
    isFavorite: false,
    offers: offers[type],
    type,
  };
};

const generatePoints = (count) =>
  new Array(count).fill(null).map(generatePoint);

export { generatePoints, CITY_NAMES, POINT_TYPE };
