import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(duration);
dayjs.extend(isBetween);

const PATTERN = {
  0: 'D',
  1: 'H',
  2: 'M',
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
  createTripInfoDate,
  formatDuration,
  calculateDiff,
  isBefore,
  isDateEquals,
  isFuture,
  isPast,
  isOngoing
};
