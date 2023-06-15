import AbstractView from '../framework/view/abstract-view.js';
import { SortType, SortTypeDescription } from '../const.js';

const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFER];

const createSortingTemplate = (currentSortType) => {
  return `
<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${Object.values(SortType)
.map((sortType) => {
const isChecked = currentSortType === sortType ? 'checked' : '';
const isDisabled = DISABLED_SORT_TYPES.includes(sortType) ? 'disabled' : '';

      return `
        <div class="trip-sort__item  trip-sort__item--${sortType}">
          <input ${isChecked} data-sort-type=${sortType} id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isDisabled}>
          <label class="trip-sort__btn" for="sort-${sortType}">${SortTypeDescription[sortType]}</label>
        </div>`;
    })
    .join('')}
</form>`;


};

export default class SortingView extends AbstractView {
  #currentSortType;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
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
