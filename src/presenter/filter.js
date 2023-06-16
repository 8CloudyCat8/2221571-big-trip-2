import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../utils/filters.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({
    filterContainer,
    pointsModel,
    filterModel
  }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    const filterCounts = {
      [FilterType.EVERYTHING]: filter[FilterType.EVERYTHING](points).length,
      [FilterType.PAST]: filter[FilterType.PAST](points).length,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length,
    };

    return Object.entries(filterCounts).map(([type, count]) => ({
      type,
      name: type,
      count,
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }
  }

  #handleModelEvent = () => this.init();

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) return;

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
