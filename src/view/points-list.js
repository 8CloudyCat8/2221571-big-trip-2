import AbstractView from '../framework/view/abstract-view.js';

const generateTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class PointsListView extends AbstractView {
  get template () {
    return generateTripEventsTemplate;
  }
}
