import dayjs from 'dayjs';
import { getRandomInteger } from './common.js';

const MIN_MONTH = -2;
const MAX_MONTH = 2;
const MIN_DAY_MONTH = 1;
const MAX_DAY_MONTH = 30;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_QUARTER = 1;
const MAX_QUARTER = 4;
const QUARTER = 15;

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

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

  return dayjs(date).minute(minutes).toDate();
};

const formatDate = (date, format) => dayjs(date).format(format).toString();

const createTripInfoDate = (start, end) => {
  const startMonth = start.getMonth();
  const endDate = end.getDate();
  const endMonth = end.getMonth();
  let result = `${dayjs(start).format('MMM DD')}&nbsp;&mdash;&nbsp;`;

  if (startMonth === endMonth) {
    result = `${result}${endDate}`;
  } else {
    result = `${result}${MONTHS[endMonth]} ${endDate}`;
  }

  return result;
};

const calculateDuration = (first, second) => {
  if (first === second) {
    return 0;
  }

  const min = Math.min(first, second);
  const max = Math.max(first, second);

  return dayjs(max).diff(dayjs(min), 'minutes');
};

const isBefore = (first, second) => dayjs(first).isBefore(dayjs(second));

const isDateEquals = (first, second) => dayjs(first).isSame(dayjs(second));

export {
  formatDate,
  getRandomDateFrom,
  getRandomDateTo,
  createTripInfoDate,
  calculateDuration,
  isBefore,
  isDateEquals
};
