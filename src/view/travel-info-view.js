import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDate } from '../utils/dates.js';

const renderRouteTrip = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }

  const routeWithoutRepeats = [];
  let previousDestination = '';

  for (const point of points) {
    const { destination } = point;
    if (destination !== previousDestination) {
      routeWithoutRepeats.push(destination);
      previousDestination = destination;
    }
  }

  if (routeWithoutRepeats.length > 3) {
    const startPoint = destinations.find((item) => item.id === routeWithoutRepeats[0]);
    const endPoint = destinations.find((item) => item.id === routeWithoutRepeats[routeWithoutRepeats.length - 1]);
    return `${startPoint.name} &mdash; ... &mdash; ${endPoint.name}`;
  }

  return routeWithoutRepeats
    .map((destination) => destinations.find((item) => item.id === destination).name)
    .join(' &mdash; ');
};

const renderDatesTrip = (points) => {
  if (points.length === 0) {
    return '';
  }

  const startDate = points[0].dateFrom !== null ? humanizePointDate(points[0].dateFrom) : '';
  const endDate = points[points.length - 1].dateTo !== null ? humanizePointDate(points[points.length - 1].dateTo) : '';
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getPricePointOffers = (point, offers) => {
  if (offers.length === 0) {
    return 0;
  }

  return point.offers.reduce((totalPrice, offer) => {
    const matchedOffer = offers.find((item) => item.type === point.type)?.offers.find((item) => item.id === offer);
    if (matchedOffer) {
      return totalPrice + matchedOffer.price;
    }
    return totalPrice;
  }, 0);
};

const renderTotalPriceTrip = (points, offers) => {
  if (points.length === 0) {
    return '';
  }

  const totalPrice = points.reduce((total, point) => {
    const pointPrice = point.basePrice + getPricePointOffers(point, offers);
    return total + pointPrice;
  }, 0);

  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

const createTripInfoTemplate = (points, destinations, offers) => {
  if (destinations.length === 0 || offers.length === 0) {
    return '';
  }

  return `
    <div class="trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${renderRouteTrip(points, destinations)}</h1>
        <p class="trip-info__dates">${renderDatesTrip(points)}</p>
      </div>
      <p class="trip-info__cost">
        ${renderTotalPriceTrip(points, offers)}
      </p>
    </div>`;
};

export default class TripInfoView extends AbstractView {
  constructor(points, destinations, offers) {
    super();
    this.points = points;
    this.destinations = destinations;
    this.offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.points, this.destinations, this.offers);
  }
}
