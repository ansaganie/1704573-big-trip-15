import { getRandomInteger } from './random';

const MONTH_AHEAD = 2;
const MIN_DAY_MONTH = 1;
const MAX_DAY_MONTH = 30;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_QUATER = 1;
const MAX_QUATER = 4;

const months = [
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

const makeTwoPlace = (input) => input.toString().padStart(2, '0');

const getRandomDateFrom = () => {
  const current = new Date();
  const date = new Date(
    current.getFullYear(),
    current.getMonth() + MONTH_AHEAD,
    getRandomInteger(MIN_DAY_MONTH, MAX_DAY_MONTH),
    getRandomInteger(MIN_HOUR, MAX_HOUR),
  );
  return date;
};

const getDateTo = (date) => {
  const minutes = 15 * getRandomInteger(MIN_QUATER, MAX_QUATER);

  return new Date(
    minutes === 15 * MAX_QUATER
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
    'MMM dd': `${months[date.getMonth()]} ${date.getDate()}`,
    'hh:mm': `${hours}:${minutes}`,
    'yyyy-mm-dd': `${year}-${month}-${dayOfMonth}`,
    'dd/mm/yy hh:mm': `${dayOfMonth}/${month}/${year.slice(2)} ${hours}:${minutes}`,
  };

  if (Object.keys(formatConverters).includes(format)) {
    return formatConverters[format];
  } else {
    throw new Error(`Such format is not supported yet ${format}`);
  }
};

export { formatDate, getRandomDateFrom, getDateTo };
