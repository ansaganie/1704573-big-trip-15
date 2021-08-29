import { isEscapePressed } from '../utils/common.js';
import { UpdateType, UserAction } from '../utils/const.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import FormView from '../view/EditForm/edit-form.js';
import { nanoid } from 'nanoid';
import { offers } from '../mock/offer.js';

const BLANK_EVENT = {
  type: 'taxi',
  offers: offers['taxi'],
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
};

class NewPoint {
  constructor(container, updateModel, closeForm) {
    this._container = container;
    this._updateModel = updateModel;
    this._closeForm = closeForm;

    this._editComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleRollUpClick = this._handleRollUpClick.bind(this);
  }

  init() {
    if (this._editComponent !== null) {
      return;
    }
    this._closeForm();
    this._editComponent = new FormView(BLANK_EVENT);
    this._editComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editComponent.setRollUpButtonClickHandler(this._handleRollUpClick);

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
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleRollUpClick() {
    this.destroy();
  }

  _handleEscKeydown(evt) {
    if (isEscapePressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(newPoint) {
    this._updateModel(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        ...newPoint,
        id: nanoid(),
      },
    );

    this.destroy();
  }
}

export default NewPoint;
