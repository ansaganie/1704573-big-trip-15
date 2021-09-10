import { isEscapePressed, isOnline } from '../utils/common.js';
import { OfflineErrorMessage, UpdateType, UserAction } from '../utils/const.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { toast } from '../utils/toast.js';
import FormView from '../view/EditForm/edit-form.js';

class NewPoint {
  constructor(
    container,
    offers,
    cityNames,
    destinations,
    updateModel,
    closeOtherForms,
    handleNewPointFormClose,
    enableNewPointButton,
  ) {
    this._container = container;
    this._offers = offers;
    this._cityNames = cityNames;
    this._destinations = destinations;
    this._updateModel = updateModel;
    this._closeOtherForms = closeOtherForms;
    this._handleNewPointFormClose = handleNewPointFormClose;
    this._enableNewPointButton = enableNewPointButton;

    this._editComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
  }

  init() {
    if (this._editComponent !== null) {
      return;
    }

    this._closeOtherForms();
    this._editComponent = new FormView(
      this._offers,
      this._cityNames,
      this._destinations,
    );
    this._editComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editComponent.setDeleteClickHandler(this._handleCancelClick);

    render(this._container, this._editComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._handleEscKeydown);
  }

  destroy() {
    if (this._editComponent === null) {
      return;
    }

    remove(this._editComponent);
    this._editComponent = null;

    document.removeEventListener('keydown', this._handleEscKeydown);
    this._enableNewPointButton();
  }

  _handleCancelClick() {
    this.destroy();
    this._handleNewPointFormClose();
  }

  _handleEscKeydown(evt) {
    if (isEscapePressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(newPoint, pending) {
    if (!isOnline()) {
      pending.showError();
      toast(OfflineErrorMessage.ADD);

      return;
    }

    pending.closeForm = this.destroy.bind(this);

    this._updateModel(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...newPoint },
      pending,
    );
  }
}

export default NewPoint;
