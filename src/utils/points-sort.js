import { calculateDiff } from './date';

const sortByDate = (first, second) =>
  new Date(first.dateFrom) - new Date(second.dateFrom);

const sortByTime = (first, second) =>
  calculateDiff(second.dateFrom, second.dateTo) -
  calculateDiff(first.dateFrom, first.dateTo);

const sortByPrice = (first, second) => second.basePrice - first.basePrice;

export { sortByDate, sortByPrice, sortByTime };
