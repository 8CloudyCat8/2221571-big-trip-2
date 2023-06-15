import { FilterType } from '../const.js';
import { isPointDateFuture, isPointDateOld, isPointDateFutureOld } from './dates.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointDateFuture(point.dateFrom) || isPointDateFutureOld(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointDateOld(point.dateTo) || isPointDateFutureOld(point.dateFrom, point.dateTo)),
};

export { filter };
