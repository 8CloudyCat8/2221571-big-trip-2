import { isPointDateFuture, isPointDateLast, isPointDateFutureLast } from './time-utils.js';

const filter = {
  everything: (points) => points,
  future: (points) => points.filter(({ dateFrom, dateTo }) => isPointDateFuture(dateFrom) || isPointDateFutureLast(dateFrom, dateTo)),
  past: (points) => points.filter(({ dateFrom, dateTo }) => isPointDateLast(dateTo) || isPointDateFutureLast(dateFrom, dateTo))
};

export { filter };
