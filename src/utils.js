const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (array) =>
  array[getRandomInteger(0, array.length - 1)];

const render = (container, element, place) => {
  if (place === RenderPosition.AFTERBEGIN) {
    container.prepend(element);
    return;
  }

  container.append(element);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const showOrHide = (element) => (element ? '' : 'visually-hidden');

const isEscapePressed = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  getRandomInteger,
  getRandomElement,
  render,
  createElement,
  capitalize,
  showOrHide,
  isEscapePressed,
  RenderPosition
};
