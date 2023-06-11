import { render, replace, remove } from '../framework/render.js';
import EditingPointView from '../view/editing.js';
import PreviewPointView from '../view/preview.js';

const Mode = {
  EDITING: 'editing',
  PREVIEW: 'preview',
};

export default class PointPresenter {
  #currentMode = Mode.PREVIEW;
  #offers = null;
  #modifiedData = null;
  #modifiedMode = null;
  #point = null;
  #editingPointElement = null;
  #pointsModel = null;
  #destinations = null;
  #pointListContainer = null;
  #previewPointElement = null;

  constructor(container, model, data, currentMode) {
    this.#pointListContainer = container;
    this.#pointsModel = model;
    this.#modifiedData = data;
    this.#modifiedMode = currentMode;
  }

init(point) {
  this.#offers = [...this.#pointsModel.offers];
  this.#point = point;
  this.#destinations = [...this.#pointsModel.destinations];

  const [prevEditingPointComponent, prevPreviewPointComponent] = [
    this.#editingPointElement,
    this.#previewPointElement,
  ];

  this.#editingPointElement = new EditingPointView(point, this.#destinations, this.#offers);
  this.#editingPointElement.setupPreviewClickHandler(this.#handlePreviewClick);
  this.#editingPointElement.setFormSubmitHandler(this.#handleFormSubmit);

  this.#previewPointElement = new PreviewPointView(point, this.#destinations, this.#offers);
  this.#previewPointElement.setEditClickHandler(this.#handleEditClick);
  this.#previewPointElement.setFavoriteClickHandler(this.#handleBestClick);

  render(this.#previewPointElement, this.#pointListContainer);

  if (prevPreviewPointComponent && prevEditingPointComponent) {
    switch (this.#currentMode) {
      case Mode.PREVIEW:
        replace(this.#previewPointElement, prevPreviewPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#editingPointElement, prevEditingPointComponent);
        break;
    }
  }

  [prevPreviewPointComponent, prevEditingPointComponent].forEach((component) => {
    component && remove(component);
  });
}

  resetView = () => {
    if (this.#currentMode === Mode.PREVIEW) {
      return;
    }
    this.#editingPointElement.reset(this.#point);
    this.#switchToPreviewPoint();
  };


  destroy = () => {
    remove(this.#previewPointElement);
    remove(this.#editingPointElement);
  };

  #handleBestClick = () => {
    this.#modifiedData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditClick = () => {
    this.#switchToEditingPoint();
  };

  #handlePreviewClick = () => {
    this.#editingPointElement.reset(this.#point);
    this.#switchToPreviewPoint();
  };

  #handleFormSubmit = (point) => {
    this.#modifiedData(point);
    this.#switchToPreviewPoint();
  };

  #switchToEditingPoint = () => {
    replace(this.#editingPointElement, this.#previewPointElement);
    document.addEventListener('keydown', this.#keydownEscape);
    this.#modifiedMode();
    this.#currentMode = Mode.EDITING;
  };

  #switchToPreviewPoint = () => {
    replace(this.#previewPointElement, this.#editingPointElement);
    document.removeEventListener('keydown', this.#keydownEscape);
    this.#currentMode = Mode.PREVIEW;
  };

  #keydownEscape = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editingPointElement.reset(this.#point);
      this.#switchToPreviewPoint();
    }
  };
}
