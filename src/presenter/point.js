import { render, replace, remove } from '../framework/render.js';
import PreviewPointView from '../view/preview-point-view.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  EDITING: 'editing',
  PREVIEW: 'preview',
};

export default class PointPresenter {
  #pointListContainer = null;
  #previewPointComponent = null;
  #editingPointComponent = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #changeData = null;
  #changeMode = null;
  #point = null;
  #mode = Mode.PREVIEW;

  constructor({pointListContainer, changeData, changeMode, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const prevPreviewPointComponent = this.#previewPointComponent;
    const prevModifyingPointComponent =  this.#editingPointComponent;

    this.#previewPointComponent = new PreviewPointView(point, this.#destinations, this.#offers);
    this.#editingPointComponent = new PointView({
      point: point,
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });

    this.#previewPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#previewPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingPointComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setResetClickHandler(this.#handleResetClick);

    if (prevPreviewPointComponent === null || prevModifyingPointComponent === null) {
      render(this.#previewPointComponent, this.#pointListContainer);
      return;
    }

    switch (this.#mode) {
      case Mode.PREVIEW:
        replace(this.#previewPointComponent, prevPreviewPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#previewPointComponent, prevModifyingPointComponent);
        this.#mode = Mode.PREVIEW;
        break;
    }

    remove(prevPreviewPointComponent);
    remove(prevModifyingPointComponent);
  }

  destroy = () => {
    remove(this.#previewPointComponent);
    remove(this.#editingPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#editingPointComponent.reset(this.#point);
      this.#replaceModifyingPointToPreviewPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.PREVIEW) {
      this.#previewPointComponent.shake();
      return;
    }

    this.#editingPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#editingPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  #replacePreviewPointToModifyingPoint = () => {
    replace(this.#editingPointComponent, this.#previewPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceModifyingPointToPreviewPoint = () => {
    replace(this.#previewPointComponent, this.#editingPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.PREVIEW;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.EDIT_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePreviewPointToModifyingPoint();
  };

  #handlePreviewClick = () => {
    this.resetView();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.EDIT_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleResetClick = (point) => {
    this.#changeData(
      UserAction.REMOVE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
