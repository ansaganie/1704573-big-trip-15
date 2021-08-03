import { getRandomInteger } from './random';

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

const getRandomDateFrom = () => {
  const current = new Date();
  const date = new Date(
    current.getFullYear(),
    current.getMonth() + 1,
    getRandomInteger(0, 30),
    getRandomInteger(0, 23),
  );
  return date;
};

const getDateTo = (date, minutes) =>
  minutes === 60
    ? date.setHours(date.getHours() + 1)
    : date.setMinutes(minutes);

const formatDate = (date, format) => {
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formatConverters = {
    'MMM dd': `${months[month]} ${dayOfMonth}`,
    'hh:mm': `${hours}:${minutes}`,
    'yyyy-mm-dd': `${year}-${month + 1}-${dayOfMonth}`,
  };

  if (Object.keys(formatConverters).includes(format)) {
    return formatConverters[format];
  } else {
    throw new Error(`Such format is not supported yet ${format}`);
  }
};

export { formatDate, getRandomDateFrom, getDateTo };
