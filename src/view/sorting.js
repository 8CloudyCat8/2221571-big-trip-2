import AbstractView from '../framework/view/abstract-view.js';
import { SortOption } from '../utils/point-sorting.js';

const generateSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--${SortOption.DAY}">
    <input data-sort-type=${SortOption.DAY} id="sort-${SortOption.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortOption.DAY}" checked>
    <label class="trip-sort__btn" for="sort-${SortOption.DAY}">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortOption.EVENT}">
    <input data-sort-type=${SortOption.EVENT} id="sort-${SortOption.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortOption.EVENT}" disabled>
    <label class="trip-sort__btn" for="sort-${SortOption.EVENT}">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortOption.TIME}">
    <input data-sort-type=${SortOption.TIME} id="sort-${SortOption.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortOption.TIME}">
    <label class="trip-sort__btn" for="sort-${SortOption.TIME}">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortOption.PRICE}">
    <input data-sort-type=${SortOption.PRICE} id="sort-${SortOption.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortOption.PRICE}">
    <label class="trip-sort__btn" for="sort-${SortOption.PRICE}">Cost</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortOption.OFFER}">
    <input data-sort-type=${SortOption.OFFER} id="sort-${SortOption.OFFER}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortOption.OFFER}" disabled>
    <label class="trip-sort__btn" for="sort-${SortOption.OFFER}">Offers</label>
  </div>
</form>`
);

const _sortTypeTransformHandler = Symbol('sortTypeTransformHandler');

export default class SortingView extends AbstractView {
  constructor() {
    super();
    this[_sortTypeTransformHandler] = (evt) => {
      if (evt.target.tagName === 'INPUT') {
        this._callback.sortTypeTransform(evt.target.dataset.sortType);
      }
    };
  }

  setupSortOptionTransformHandler(callback) {
    this._callback.sortTypeTransform = callback;
    this.element.addEventListener('click', this[_sortTypeTransformHandler]);
  }

  get template() {
    return generateSortingTemplate();
  }
}
