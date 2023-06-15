import { render, remove, RenderPosition } from '../framework/render.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #destroyCallback = null;
  #targetsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #creatingPointComponent = null;

  constructor({ pointListContainer, changeData, targetsModel, offersModel }) {
    this.#targetsModel = targetsModel;
    this.#offersModel = offersModel;
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    if (this.#creatingPointComponent !== null) return;
    this.#destinations = [...this.#targetsModel.destinations];
    this.#offers = [...this.#offersModel.offers];
    this.#creatingPointComponent = new PointView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#creatingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingPointComponent.setResetClickHandler(this.#handleResetClick);
    render(this.#creatingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
  };

  destroy = () => {
    if (this.#creatingPointComponent === null) return;
    this.#destroyCallback?.();
    remove(this.#creatingPointComponent);
    this.#creatingPointComponent = null;
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
  };

  setSaving = () => {
    this.#creatingPointComponent.updateElement({ isSaving: true, isDisabled: true });
  };

  setAborting = () => {
    this.#creatingPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#creatingPointComponent.updateElement({
      isDeleting: false,
      isDisabled: false,
      isSaving: false
    });
  };

  #escapeKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.CREATE_POINT, UpdateType.MINOR, point);
  };
}
