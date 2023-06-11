import { getRandomInt, getRandomElement } from '../utils/auxiliary-utilities.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const POINTS_AMOUNT = 20;
const TRANSPORTATION_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const PLACE_NAMES = ['London', 'New York ', 'Sydney', 'Tokyo', 'Toronto'];

const ATTRACTION_DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const Cost = {
  MIN: 100,
  MAX: 1000
};

const Quantity = {
  MIN: 1,
  MAX: 4
};

const ImageIndex = {
  MIN: 0,
  MAX: 10
};

const generateDescription = () => {
  const descriptionElementsCount = getRandomInt(Quantity.MIN, Quantity.MAX);
  const descriptionElements = Array.from({ length: descriptionElementsCount }, () => getRandomElement(ATTRACTION_DESCRIPTIONS));
  return descriptionElements.join(' ');
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInt(ImageIndex.MIN, ImageIndex.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => {
  const picturesCount = getRandomInt(Quantity.MIN, Quantity.MAX);
  const pictures = Array.from({ length: picturesCount }, generatePicture);

  return {
    id,
    description: generateDescription(),
    name: PLACE_NAMES[id],
    pictures,
  };
};

const getDestinations = () => Array.from({ length: PLACE_NAMES.length }, (_, index) => generateDestination(index));

const generateOffer = (id, pointType) => ({
  id,
  title: `offer for ${pointType}`,
  price: getRandomInt(Cost.MIN, Cost.MAX)
});

const generateOptionsByCategory = (pointType) => {
  const offersCount = getRandomInt(Quantity.MIN, Quantity.MAX);
  const offers = Array.from({ length: offersCount }, (_, index) => generateOffer(index + 1, pointType));

  return {
    type: pointType,
    offers
  };
};

const getOptionsByCategory = () => Array.from({ length: TRANSPORTATION_TYPES.length }, (_, index) => generateOptionsByCategory(TRANSPORTATION_TYPES[index]));

const offersByType = getOptionsByCategory();
const destinations = getDestinations();

const generatePoint = () => {
  const offersByTypePoint = getRandomElement(offersByType);
  const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);

  const point = {
    basePrice: getRandomInt(Cost.MIN, Cost.MAX),
    dateFrom: dayjs().add(getRandomInt(-3, 0), 'day').add(getRandomInt(-2, 0), 'hour').add(getRandomInt(-59, 0), 'minute'),
    dateTo: dayjs().add(getRandomInt(0, 2), 'day').add(getRandomInt(0, 2), 'hour').add(getRandomInt(0, 59), 'minute'),
    destinationId: getRandomElement(destinations).id,
    id: nanoid(),
    isFavorite: Boolean(getRandomInt()),
    offerIds: Array.from({length: getRandomInt(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInt(0, allOfferIdsByTypePoint.length - 1)]),
    type: offersByTypePoint.type,
  };

  return point;
};

const getPoints = () => Array(POINTS_AMOUNT).fill().map(() => generatePoint()).sort();

export { getPoints, getDestinations, getOptionsByCategory, TRANSPORTATION_TYPES };
