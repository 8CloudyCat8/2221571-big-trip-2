const API = 'https://18.ecmascript.pages.academy/big-trip';
const VERIFICATION = 'Basic gjpgjpphjfhdg';

const UserAction = {
  REMOVE_POINT: 'REMOVE_POINT',
  EDIT_POINT: 'EDIT_POINT',
  CREATE_POINT: 'CREATE_POINT'
};

const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const SortTypeDescription = {
  [SortType.DAY]: 'Day',
  [SortType.EVENT]: 'Event',
  [SortType.TIME]: 'Time',
  [SortType.PRICE]: 'Price',
  [SortType.OFFER]: 'Offer'
};

const PointType = {
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship'
};

const PointTypeDescription = {
  [PointType.FLIGHT]: 'Flight',
  [PointType.CHECK_IN]: 'Check-in',
  [PointType.SIGHTSEEING]: 'Sightseeing',
  [PointType.RESTAURANT]: 'Restaurant',
  [PointType.TAXI]: 'Taxi',
  [PointType.BUS]: 'Bus',
  [PointType.TRAIN]: 'Train',
  [PointType.SHIP]: 'Ship',
  [PointType.DRIVE]: 'Drive'
};

const ApiServiceResponseMethod = {
  DELETE: 'DELETE',
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};


export { UserAction, UpdateType, FilterType, SortType, SortTypeDescription, PointType, PointTypeDescription, ApiServiceResponseMethod, VERIFICATION, API, TimeLimit };
