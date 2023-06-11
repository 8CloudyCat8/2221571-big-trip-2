import dayjs from 'dayjs';

const SortOption = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const sortTimePoint = (pointA, pointB) => dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));

const sorting = {
  [SortOption.DAY]: (points) => points.sort(sortDayPoint),
  [SortOption.TIME]: (points) => points.sort(sortTimePoint),
  [SortOption.PRICE]: (points) => points.sort(sortPricePoint)
};

export { SortOption, sorting };
