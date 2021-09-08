import { FilterType } from './const';
import { isFuture, isOngoing, isPast } from './date';

export const filters = {
  [FilterType.EVERYTHING]: () => true,
  [FilterType.FUTURE]: ({ dateFrom, dateTo }) =>
    isFuture(dateFrom) || isOngoing(dateFrom, dateTo),
  [FilterType.PAST]: ({ dateFrom, dateTo }) =>
    isPast(dateTo) || isOngoing(dateFrom, dateTo),
};
