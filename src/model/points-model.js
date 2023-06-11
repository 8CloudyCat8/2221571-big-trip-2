export default class PointsModel {
  #data = {
    destinations: [],
    points: [],
    offers: []
  };

  init(points, destinations, offers) {
    this.#data.destinations = destinations;
    this.#data.points = points;
    this.#data.offers = offers;
  }

  get data() {
    return this.#data;
  }

  get destinations() {
    return this.#data.destinations;
  }

  get points() {
    return this.#data.points;
  }

  get offers() {
    return this.#data.offers;
  }
}
