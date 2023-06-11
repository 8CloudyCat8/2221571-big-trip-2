import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;
  const checkedStatus = isChecked ? 'checked' : '';
  const disableStatus = count === 0 ? 'disabled' : '';
  return `<div class="trip-filters__filter">
            <input id="filter-${name}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" ${checkedStatus} value="${name}" ${disableStatus}>
            <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
          </div>`;
};

export default class FilterView extends AbstractView {
  #filters;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return `<form class="trip-filters" action="#" method="get">
            ${this.#filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('')}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
  }
}
