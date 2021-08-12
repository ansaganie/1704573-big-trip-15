import { getRandomElement, getRandomInteger } from '../utils/common.js';

const PICSUM_LINK = 'http://picsum.photos/300/200?r=';

const DESCRIPTIONS = [
  '',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const PICTURE_MIN_COUNT = 0;
const PICTURE_MAX_COUNT = 5;

const getRandomPictures = (name, quantity) =>
  new Array(quantity).fill().map(() => ({
    description: `Photo of ${name}`,
    src: `${PICSUM_LINK}${Math.random()}`,
  }));

const getRandomDestination = (name) => ({
  name,
  description: getRandomElement(DESCRIPTIONS),
  pictures: getRandomPictures(
    name,
    getRandomInteger(PICTURE_MIN_COUNT, PICTURE_MAX_COUNT),
  ),
});

export { getRandomDestination };
