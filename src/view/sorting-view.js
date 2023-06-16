import AbstractView from '../framework/view/abstract-view.js';
import { SortType, SortTypeDescription, DISABLED_SORT_TYPES } from '../const.js';

export default class SortingView extends AbstractView {
  constructor(currentSortType) {
    super();
    this.currentSortType = currentSortType;
  }

  get template() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${Object.values(SortType).map((sortType) => {
          return `
            <div class="trip-sort__item  trip-sort__item--${sortType}">
              <input ${this.currentSortType === sortType ? 'checked' : ''}
                data-sort-type="${sortType}" id="sort-${sortType}"
                class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"
                ${DISABLED_SORT_TYPES.includes(sortType) ? 'disabled' : ''}
              >
              <label class="trip-sort__btn" for="sort-${sortType}">${SortTypeDescription[sortType]}</label>
            </div>
          `;
        }).join('')}
      </form>`;
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
