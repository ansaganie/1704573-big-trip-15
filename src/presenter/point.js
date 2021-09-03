import PointView from '../view/TripList/point.js';
import FormView from '../view/EditForm/edit-form.js';
import { remove, render, replace } from '../utils/render.js';
import { isEscapePressed } from '../utils/common.js';
import { UpdateType, UserAction } from '../utils/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class Point {
  constructor(
    container,
    offers,
    cityNames,
    destinations,
    updateModel,
    closeOtherForms,
  ) {
    this._container = container;
    this._offers = offers;
    this._cityNames = cityNames;
    this._destinations = destinations;
    this._updateModel = updateModel;
    this._closeOtherForms = closeOtherForms;

    this._pointComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollUpClick = this._handleRollUpClick.bind(this);
    this._handleRollDownClick = this._handleRollDownClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editComponent;

    this._pointComponent = new PointView(point);
    this._editComponent = new FormView(
      this._offers,
      this._cityNames,
      this._destinations,
      this._point,
    );

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
    const { dateFrom, dateTo, basePrice, type, offers} = this._point;

    let isOffersChanged = false;

    if (type !== updatedPoint.type) {
      isOffersChanged = true;
    } else {
      for(let i = 0; i < offers.length; i++) {
        const first = offers[i];
        const second = updatedPoint.offers.find((offer) => first.id === offer.id);

        if (first.isChecked !== second.isChecked) {
          isOffersChanged = true;
          break;
        }
      }
    }

    const isMinorUpdate =
      dateFrom !== updatedPoint.dateFrom ||
      dateTo !== updatedPoint.dateTo ||
      basePrice !== updatedPoint.basePrice ||
      type !== updatedPoint.type ||
      isOffersChanged;

    this._updateModel(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint,
    );

    this._closeEditForm();
  }

  _handleDeleteClick(deletedPoint) {
    this._updateModel(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      deletedPoint,
    );
  }

  _handleEscKeydown(evt) {
    if (isEscapePressed(evt)) {
      evt.preventDefault();
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
    this._editComponent.setDeleteClickHandler(this._handleDeleteClick);

    replace(this._editComponent, this._pointComponent);
    this._closeOtherForms();
    this._mode = Mode.EDITING;
  }

  _handleFavoriteClick() {
    const update = { ...this._point };
    update.isFavorite = !this._point.isFavorite;
    this._updateModel(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  }
}

export default Point;
