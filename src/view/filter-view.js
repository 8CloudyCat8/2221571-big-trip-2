import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filterItems, currentFilterType) => `
  <form class="trip-filters" action="#" method="get">
    ${filterItems.map(({ type, name, count }) => `
      <div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" ${type === currentFilterType ? 'checked' : ''} value="${type}" ${count === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>
    `).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters;
  #currentFilter;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
