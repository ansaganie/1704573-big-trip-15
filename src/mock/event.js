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
  const dateTo =  getDateTo(new Date(dateFrom), Math.random() > 0.5 ? 60 : 30);
  return {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom,
    dateTo: new Date(dateTo),
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
