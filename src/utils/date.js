import { getRandomInteger } from './common.js';

const MONTH_AHEAD = 2;
const MIN_DAY_MONTH = 1;
const MAX_DAY_MONTH = 30;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_QUARTER = 1;
const MAX_QUARTER = 4;
const DATE_PLACES = 2;
const DATE_PAD = '0';
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

const makeTwoPlace = (input) =>
  input.toString().padStart(DATE_PLACES, DATE_PAD);

const getRandomDateFrom = () => {
  const current = new Date();
  current.setMonth(current.getMonth() + MONTH_AHEAD);
  current.setDate(getRandomInteger(MIN_DAY_MONTH, MAX_DAY_MONTH));
  current.setHours(getRandomInteger(MIN_HOUR, MAX_HOUR));
  current.setMinutes(0);
  current.setSeconds(0);

  return current;
};

const getDateTo = (date) => {
  const minutes = QUARTER * getRandomInteger(MIN_QUARTER, MAX_QUARTER);

  return new Date(
    minutes === QUARTER * MAX_QUARTER
      ? new Date(date).setHours(date.getHours() + 1)
      : new Date(date).setMinutes(minutes),
  );
};

const formatDate = (date, format) => {
  const dayOfMonth = makeTwoPlace(date.getDate());
  const month = makeTwoPlace(date.getMonth() + 1);
  const year = makeTwoPlace(date.getFullYear());
  const hours = makeTwoPlace(date.getHours());
  const minutes = makeTwoPlace(date.getMinutes());

  const formatConverters = {
    'MMM dd': `${MONTHS[date.getMonth()]} ${date.getDate()}`,
    'hh:mm': `${hours}:${minutes}`,
    'yyyy-mm-dd': `${year}-${month}-${dayOfMonth}`,
    'dd/mm/yy hh:mm':
      `${dayOfMonth}/${month}/${year.slice(2)} ${hours}:${minutes}`,
  };

  if (Object.keys(formatConverters).includes(format)) {
    return formatConverters[format];
  } else {
    throw new Error(`Such format is not supported yet ${format}`);
  }
};

const createTripInfoDate = (start, end) => {
  const startDate = start.getDate();
  const startMonth = start.getMonth();
  const endDate = end.getDate();
  const endMonth = end.getMonth();
  let result = `${MONTHS[startMonth]} ${startDate}&nbsp;&mdash;&nbsp;`;

  if (startMonth === endMonth) {
    result = `${result}${endDate}`;
  } else {
    result = `${result}${MONTHS[endMonth]} ${endDate}`;
  }

  return result;
};

export { formatDate, getRandomDateFrom, getDateTo, createTripInfoDate };
