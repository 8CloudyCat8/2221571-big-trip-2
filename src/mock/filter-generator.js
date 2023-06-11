import { filter } from '../utils/point-filter.js';

export const buildFilter = (points) => Object.entries(filter).map(([filterName, filterPoints]) => ({
  name: filterName,
  count: filterPoints(points).length,
}));
