import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/auxiliary-utilities.js';
import { SortOption, sorting } from '../utils/point-sorting.js';
import PointPresenter from './point-presenter.js';
import PointsListView from '../view/points-list.js';
import SortingView from '../view/sorting.js';
import NoPointView from '../view/no-point.js';

export default class BoardPresenter {
  #selectedSortOption = SortOption.DAY;
  #originBoardPoints = [];
  #journeyContainer = null;
  #pointsModel = null;
  #boardPoints = null;
  #emptyPointComponent = new NoPointView();
  #sortComponent = new SortingView();
  #itemsListComponent = new PointsListView();
  #pointPresenter = new Map();

  constructor(journeyContainer, pointsModel) {
    this.#journeyContainer = journeyContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#originBoardPoints = [...this.#pointsModel.points];
    const hasElements = this.#boardPoints.length > 0;
    hasElements ? this.#renderSort() : this.#renderEmptyPoints();
    this.#renderPointList();
  }

  #handleModeTransform = () => this.#pointPresenter.forEach(p => p.resetView());

  #handlePointTransform = modifiedPoint => {
    [this.#boardPoints, this.#originBoardPoints].forEach(arr => updateItem(arr, modifiedPoint));
    this.#pointPresenter.get(modifiedPoint.id).init(modifiedPoint);
  };

  #sortPoint = sortType => {
    sorting[sortType](this.#boardPoints);
    this.#selectedSortOption = sortType;
  };


  #handleSortOptionTransform = (sortType) => {
    if (this.#selectedSortOption !== sortType) {
      this.#sortPoint(sortType);
      this.#emptyPointList();
      this.#renderPointList();
    }
  };

  #renderSort = () => {
    sorting[SortOption.DAY](this.#boardPoints);
    render(this.#sortComponent, this.#journeyContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setupSortOptionTransformHandler(this.#handleSortOptionTransform);
  };

  #renderPoint = (point) => {
  const pointPresenter = new PointPresenter(this.#itemsListComponent.element, this.#pointsModel, this.#handlePointTransform, this.#handleModeTransform);
  pointPresenter.init(point);
  this.#pointPresenter.set(point.id, pointPresenter);
};

  #renderPoints = (from, to) => this.#boardPoints.slice(from, to).forEach(this.#renderPoint);

  #renderEmptyPoints = () => render(this.#emptyPointComponent, this.#journeyContainer, RenderPosition.AFTERBEGIN);

  #emptyPointList = () => (this.#pointPresenter.forEach(presenter => presenter.destroy()), this.#pointPresenter.clear());

  #renderPointList = () => (render(this.#itemsListComponent, this.#journeyContainer), this.#renderPoints(0, this.#boardPoints.length));

}
