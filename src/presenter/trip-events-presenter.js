import EventsView from '../view/trip-events.js';
import RoutePointView from '../view/route-point.js';
import CreatingFormView from '../view/creating-form.js';
import EditingFormView from '../view/editing-form.js';
import SortingView from '../view/sorting.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor() {
    this.eventsList = new EventsView();
  }

  init(tripContainer) {
    this.tripContainer = tripContainer;

    render(new SortingView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new EditingFormView(), this.eventsList.getElement());

    Array.from({ length: 3 }, () => new RoutePointView())
      .forEach((point) => render(point, this.eventsList.getElement()));

    render(new CreatingFormView(), this.eventsList.getElement());
  }
}
