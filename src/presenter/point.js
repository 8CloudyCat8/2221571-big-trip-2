import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PreviewPointView from '../view/preview-point-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  EDITING: 'editing',
  PREVIEW: 'preview',
};

export default class PointPresenter {
  #mode = Mode.PREVIEW;
  #pointListContainer = null;
  #previewPointComponent = null;
  #editingPointComponent = null;
  #targetsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #changeData = null;
  #changeMode = null;
  #point = null;

  constructor({pointListContainer, changeData, changeMode, targetsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#targetsModel = targetsModel;
    this.#offersModel = offersModel;
  }

  init(point) {
    this.#point = point;
    this.#destinations = [...this.#targetsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const prevModifyingPointComponent =  this.#editingPointComponent;
    const prevPreviewPointComponent = this.#previewPointComponent;

    this.#previewPointComponent = new PreviewPointView(point, this.#destinations, this.#offers);
    this.#editingPointComponent = new PointView({
      point: point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });

    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setResetClickHandler(this.#handleResetClick);
    this.#previewPointComponent.setChangeClickHandler(this.#handleChangeClick);
    this.#previewPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingPointComponent.setPreviewClickHandler(this.#handlePreviewClick);

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

    remove(prevModifyingPointComponent);
    remove(prevPreviewPointComponent);
  }

  destroy = () => {
    remove(this.#editingPointComponent);
    remove(this.#previewPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#editingPointComponent.reload(this.#point);
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
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceModifyingPointToPreviewPoint = () => {
    replace(this.#previewPointComponent, this.#editingPointComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
    this.#mode = Mode.PREVIEW;
  };

  #escapeKeyDownHandler = (evt) => {
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

  #handleChangeClick = () => {
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
