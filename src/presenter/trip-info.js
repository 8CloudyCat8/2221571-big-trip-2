export default class TripInfoPresenter {
  #points = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #targetsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  constructor(tripInfoContainer, targetsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#targetsModel = targetsModel;
    this.#offersModel = offersModel;
  }

  init(points) {
    this.#points = points;
    this.#destinations = [...this.#targetsModel.destinations];
    this.#offers = [...this.#offersModel.offers];
    this.#tripInfoComponent = new TripInfoView(this.#points, this.#destinations, this.#offers);
    render(this.#tripInfoComponent, this.#tripInfoContainer);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}

import { render, remove } from '../framework/render.js';
import TripInfoView from '../view/travel-info-view.js';
