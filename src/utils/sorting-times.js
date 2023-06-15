import dayjs from 'dayjs';
import { SortType } from '../const';

const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTimePoint = (pointA, pointB) => {
  const timePointFirst = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointSecond = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointSecond - timePointFirst;
};

const sorting = {
  [SortType.DAY]: (points) => points.sort(sortDayPoint),
  [SortType.TIME]: (points) => points.sort(sortTimePoint),
  [SortType.PRICE]: (points) => points.sort(sortPricePoint)
};

export { sorting };

