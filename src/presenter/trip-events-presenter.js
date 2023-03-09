import EventsView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import EditingFormView from '../view/editing-form.js';
import SortingView from '../view/sorting.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor(tripContainer) {
    this.eventsList = new EventsView();
    this.tripContainer = tripContainer;
  }

  init(routePointsModel) {
    this.routePointsModel = routePointsModel;
    this.boardRoutePoints = [...this.routePointsModel.getRoutePoints()];
    render(new SortingView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new EditingFormView(this.boardRoutePoints[0]), this.eventsList.getElement());

    this.boardRoutePoints.forEach((routePoint) => render(new RoutePointView(routePoint), this.eventsList.getElement()));
  }
}
