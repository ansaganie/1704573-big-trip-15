import PointView from '../view/TripList/point.js';
import FormView from '../view/EditForm/edit-form.js';
import { remove, render, replace } from '../utils/render.js';
import { isEscapePressed } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class Point {
  constructor(container, updateData, closeOpenForm) {
    this._container = container;
    this._updateData = updateData;
    this._closeOpenForm = closeOpenForm;

    this._pointComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollUpClick = this._handleRollUpClick.bind(this);
    this._handleRollDownClick = this._handleRollDownClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editComponent;

    this._pointComponent = new PointView(point);
    this._editComponent = new FormView(point);

    this._pointComponent.setRollDownButtonClickHandler(
      this._handleRollDownClick,
    );
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._container, this._pointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeEditForm();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editComponent);
  }

  _closeEditForm() {
    this._editComponent.unsetEventHandlers();
    document.removeEventListener('keydown', this._handleEscKeydown);
    replace(this._pointComponent, this._editComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleFormSubmit(updatedPoint) {
    this._updateData(updatedPoint);
    this._closeEditForm();
  }

  _handleEscKeydown(evt) {
    if (isEscapePressed(evt)) {
      this._editComponent.resetState(this._point);
      this._closeEditForm();
    }
  }

  _handleRollUpClick() {
    this._editComponent.resetState(this._point);
    this._closeEditForm();
  }

  _handleRollDownClick() {
    document.addEventListener('keydown', this._handleEscKeydown);
    this._editComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editComponent.setRollUpButtonClickHandler(this._handleRollUpClick);

    replace(this._editComponent, this._pointComponent);
    this._closeOpenForm();
    this._mode = Mode.EDITING;
  }

  _handleFavoriteClick() {
    const updatedPoint = { ...this._point };
    updatedPoint.isFavorite = !this._point.isFavorite;
    this._updateData(updatedPoint);
  }
}

export default Point;
