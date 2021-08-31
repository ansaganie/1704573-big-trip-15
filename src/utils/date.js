import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { getRandomInteger } from './common.js';

dayjs.extend(duration);
dayjs.extend(isBetween);

const MIN_MONTH = -2;
const MAX_MONTH = 2;
const MIN_DAY_MONTH = 1;
const MAX_DAY_MONTH = 30;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_QUARTER = 1;
const MAX_QUARTER = 8;
const QUARTER = 15;
const PATTERN = {
  0: 'D',
  1: 'H',
  2: 'M',
};

const getRandomDateFrom = () => {
  const randomMonth = getRandomInteger(MIN_MONTH, MAX_MONTH);
  const randomDay = getRandomInteger(MIN_DAY_MONTH, MAX_DAY_MONTH);
  const randomHours = getRandomInteger(MIN_HOUR, MAX_HOUR);

  return dayjs()
    .add(randomMonth, 'month')
    .date(randomDay)
    .hour(randomHours)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
};

const getRandomDateTo = (date) => {
  const minutes = QUARTER * getRandomInteger(MIN_QUARTER, MAX_QUARTER);

  return dayjs(date).add(minutes, 'minute').toDate();
};

const formatDate = (date, format) => dayjs(date).format(format).toString();

const createTripInfoDate = (start, end) => {
  let result = `${dayjs(start).format('MMM DD')}&nbsp;&mdash;&nbsp;`;

  if (start.getMonth() === end.getMonth()) {
    result = `${result}${end.getDate()}`;
  } else {
    result = `${result}${dayjs(end).format('MMM DD')}`;
  }

  return result;
};

const calculateDiff = (first, second) => {
  if (first === second) {
    return 0;
  }

  const min = Math.min(first, second);
  const max = Math.max(first, second);

  return dayjs(max).diff(dayjs(min));
};

const formatDuration = (period) => dayjs
  .duration(period)
  .format('DD-HH-mm')
  .split('-')
  .map((value, index) => {
    if (+value !== 0) {
      return `${value}${PATTERN[index]} `;
    }

    return '';
  }).join('');

const isBefore = (first, second) => dayjs(first).isBefore(dayjs(second));

const isDateEquals = (first, second) => dayjs(first).isSame(dayjs(second));

const isFuture = (date) => dayjs().isBefore(date);

const isPast = (date) => dayjs().isAfter(date);

const isOngoing = (from, to) => dayjs().isBetween(from, to);

export {
  formatDate,
  getRandomDateFrom,
  getRandomDateTo,
  createTripInfoDate,
  formatDuration,
  calculateDiff,
  isBefore,
  isDateEquals,
  isFuture,
  isPast,
  isOngoing
};
