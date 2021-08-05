import { getDateTo, getRandomDateFrom } from '../utils/date';
import { getRandomInteger, getRandomElement } from '../utils/random';
import { getRandomDestination } from './destination';
import { offers } from './offer';

const MAX_PRICE = 300;
const MIN_PRICE = 5000;

const cityNames = [
  'Paris',
  'London',
  'Lisbon',
  'Oslo',
  'Helsinki',
  'Rio de Janeiro',
  'Tokio',
  'Berlin',
];

const pointType = [
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
  const type = getRandomElement(pointType);
  const dateFrom = getRandomDateFrom();
  return {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: getRandomDestination(getRandomElement(cityNames)),
    isFavorite: false,
    offers: offers[type],
    type,
  };
};

const generatePoints = (count) =>
  new Array(count).fill(null).map(generatePoint);

export { generatePoints, cityNames };
