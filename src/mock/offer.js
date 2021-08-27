import { getRandomInteger } from '../utils/common';

export const offers = {
  taxi: [
    {
      title: 'Upgrade to comfort class',
      price: 50,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Order Uber',
      price: 20,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  bus: [
    {
      title: 'Add luggage',
      price: 30,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Switch to comfort class',
      price: 100,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  train: [
    {
      title: 'Choose seats',
      price: 5,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add luggage',
      price: 30,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  ship: [
    {
      title: 'Choose seats',
      price: 5,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add meal',
      price: 15,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add luggage',
      price: 30,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Switch to comfort class',
      price: 100,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  flight: [
    {
      title: 'Choose seats',
      price: 5,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add luggage',
      price: 30,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Switch to comfort class',
      price: 100,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add meal',
      price: 15,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  'check-in': [
    {
      title: 'Add meal',
      price: 15,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Order Uber',
      price: 20,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  sightseeing: [],
  drive: [
    {
      title: 'Switch to comfort class',
      price: 100,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
  restaurant: [
    {
      title: 'Choose meal',
      price: 180,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      title: 'Add meal',
      price: 15,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ],
};
