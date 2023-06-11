import StatefulRenderableView from '../framework/view/abstract-stateful-view.js';
import { getDateTime } from '../utils/time-utils.js';
import { doUppercaseString } from '../utils/auxiliary-utilities.js';
import { TRANSPORTATION_TYPES } from '../mock/point-generator.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const renderTargetPictures = (pictures) => pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`).join('');

const renderTargetNames = (destinations) => destinations.map(({ name }) => `<option value="${name}"></option>`).join('');

const renderOffers = (allOptions, checkedOffers) => allOptions.map(offer => {
  const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
}).join('');

const renderModifyingPointDateModel = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
  </div>`
);

const renderModifyingPointTypeModel = (currentType) => TRANSPORTATION_TYPES.map(type => `
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${doUppercaseString(type)}</label>
  </div>
`).join('');

const createEditingPointModel = (point, destinations, offers) => {
  const {basePrice, type, destinationId, dateFrom, dateTo, offerIds} = point;
  const allPointTypeOffers = offers.find((offer) => offer.type === type);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderModifyingPointTypeModel(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destinationId}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${destinations[destinationId].name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderTargetNames(destinations)}
          </datalist>
        </div>

        ${renderModifyingPointDateModel(dateFrom, dateTo)}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Cost</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${renderOffers(allPointTypeOffers.offers, offerIds)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations[destinationId].description}</p>
          <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderTargetPictures(destinations[destinationId].pictures)}
                      </div>
                    </div>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class EditingPointView extends StatefulRenderableView {
  #destination = null;
  #offers = null;
  #datepicker = null;

  constructor(point, destination, offers) {
    super();
    this._state = EditingPointView.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;
    this.#setupInnerHandlers();
    this.#setupDatepickerFrom();
    this.#setupDatepickerTo();
  }

  removeElement = () => {
    super.removeElement();
    this.#datepicker?.destroy();
    this.#datepicker = null;
  };

  get template() {
    return createEditingPointModel(this._state, this.#destination, this.#offers);
  }

  setupPreviewClickHandler = (callback) => (this._callback.previewClick = callback, this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#previewClickHandler));

  #previewClickHandler = (evt) => (evt.preventDefault(), this._callback.previewClick());

  reset = (point) => this.updateElement(EditingPointView.parsePointToState(point));

  setFormSubmitHandler = (callback) => (this._callback.formSubmit = callback, this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitForm));

  _resetHandlers = () => {
    this.#setupInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setupPreviewClickHandler(this._callback.previewClick);
    this.#setupDatepickerFrom();
    this.#setupDatepickerTo();
  };

  #pointDateFromTransformHandler = ([userDate]) => this.updateElement({
    dateFrom: userDate
  });

  #pointDateToTransformHandler = ([userDate]) => this.updateElement({
    dateTo: userDate
  });

  #pointTargetTransformHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destination.find(dest => dest.name === evt.target.value);
    this.updateElement({
      destinationId: destination.id
    });
  };

  #pointPriceTransformHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  #pointTypeTransformHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offerIds: []
    });
  };

  #setupDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(this.element.querySelector('#event-start-time-1'), {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onTransform: this.#pointDateFromTransformHandler,
      });
    }
  };

  #setupDatepickerTo = () => {
    if (this._state.dateTo) {
      this.#datepicker = flatpickr(this.element.querySelector('#event-end-time-1'), {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onTransform: this.#pointDateToTransformHandler,
      });
    }
  };

  #offersTransformHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number(evt.target.id.slice(-1));
    this._state.offerIds.includes(offerId) ? this._state.offerIds = this._state.offerIds.filter((n) => n !== offerId) : this._state.offerIds.push(offerId);
    this.updateElement({
      offerIds: this._state.offerIds
    });
  };

  #submitForm = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditingPointView.parseStateToPoint(this._state));
  };

  #setupInnerHandlers = () => {
    const element = this.element;
    element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeTransformHandler);
    element.querySelector('.event__input').addEventListener('change', this.#pointTargetTransformHandler);
    element.querySelector('.event__available-offers').addEventListener('change', this.#offersTransformHandler);
    element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceTransformHandler);
  };

  static parsePointToState = (point) => ({
    ...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate()
  });

  static parseStateToPoint = (state) => ({
    ...state
  });
}
