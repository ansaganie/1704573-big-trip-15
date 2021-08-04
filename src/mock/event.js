import { getDateTo, getRandomDateFrom } from '../utils/date';
import { getRandomInteger, getRandomElement } from '../utils/random';
import { getRandomDestination } from './destination';
import { offers } from './offer';

const MAX_PRICE = 300;
const MIN_PRICE = 5000;

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

let globalId = 0;

const generatePoint = () => {
  const type = getRandomElement(pointType);
  const dateFrom = getRandomDateFrom();
  return {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: getRandomDestination(),
    id: globalId++,
    isFavorite: false,
    offers: offers[type],
    type,
  };
};

const generatePoints = (count) =>
  new Array(count).fill(null).map(generatePoint);

export { generatePoints };
