import { getRandomInteger, getRandomElement } from '../utils/common.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const POINTS_COUNT = 20;
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATION_NAMES = ['London', 'New York ', 'Sydney', 'Tokyo', 'Toronto'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'];

const ElementsCount = {
  MIN: 1,
  MAX: 4
};

const PictureNumber = {
  MIN: 0,
  MAX: 10
};

const Price = {
  MIN: 100,
  MAX: 1000
};

const generateDescription = () => {
  let description = '';
  for (let i = 0; i < getRandomInteger(ElementsCount.MIN, ElementsCount.MAX); i++) {
    description += ` ${getRandomElement(DESCRIPTIONS)}`;
  }
  return description;
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(PictureNumber.MIN, PictureNumber.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => ({
  id,
  description: generateDescription(),
  name: DESTINATION_NAMES[id],
  pictures: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}, generatePicture),
});

const getDestinations = () => Array.from({length: DESTINATION_NAMES.length}, (_, index) => generateDestination(index));

const generateOffer = (id, pointType) => ({
  id,
  title: `offer for ${pointType}`,
  price: getRandomInteger(Price.MIN, Price.MAX)
});

const generateOffersByType = (pointType) => ({
  type: pointType,
  offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}, (_, index) => generateOffer(index + 1, pointType)),
});

const getOffersByType = () => Array.from({length: POINT_TYPES.length}, (_, index) => generateOffersByType(POINT_TYPES[index]));

const offersByType = getOffersByType();
const destinations = getDestinations();

const generatePoint = () => {
  const randomOfferType = getRandomElement(offersByType);
  const offerIdsByType = randomOfferType.offers.map((offer) => offer.id);

  const basePrice = getRandomInteger(Price.MIN, Price.MAX);
  const dateFrom = dayjs().add(getRandomInteger(-3, 0), 'day').add(getRandomInteger(-2, 0), 'hour').add(getRandomInteger(-59, 0), 'minute');
  const dateTo = dayjs().add(getRandomInteger(0, 2), 'day').add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 59), 'minute');
  const destinationId = getRandomElement(destinations).id;
  const id = nanoid();
  const isFavorite = Boolean(getRandomInteger());
  const offerIds = Array.from({length: getRandomInteger(0, offerIdsByType.length)}).map(() => offerIdsByType[getRandomInteger(0, offerIdsByType.length - 1)]);
  const type = randomOfferType.type;

  return { basePrice, dateFrom, dateTo, destinationId, id, isFavorite, offerIds, type, };
};

const getPoints = () => Array.from({length: POINTS_COUNT}).map(() => generatePoint()).sort();

export { getPoints, getDestinations, getOffersByType, POINT_TYPES };

