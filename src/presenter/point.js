import PointView from '../view/EventList/event-item.js';
import FormView from '../view/EditForm/edit-form.js';
import { render, replace } from '../utils/render.js';
import { isEscapePressed } from '../utils/common.js';

class Point {
  constructor(container) {
    this._container = container;

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._onEditFromSubmit = this._onEditFromSubmit.bind(this);
    this._onRollUpButtonClick = this._onRollUpButtonClick.bind(this);
    this._onRollDownButtonClick = this._onRollDownButtonClick.bind(this);
  }

  init(event) {
    this._pointComponent = new PointView(event);
    this._formComponent = new FormView(event);

    render(this._container, this._pointComponent);

    this._pointComponent.setRollDownButtonClickHandler(
      this._onRollDownButtonClick,
    );
  }

  _onEscKeydown(evt) {
    if (isEscapePressed(evt)) {
      replace(this._pointComponent, this._formComponent);

      this._formComponent.unsetEscapeKeydownHandler();
      this._formComponent.unsetFormSubmitHandler();
      this._formComponent.unsetRollUpButtonClickHandler();
    }
  }

  _onEditFromSubmit() {
    replace(this._pointComponent, this._formComponent);

    this._formComponent.unsetEscapeKeydownHandler();
    this._formComponent.unsetFormSubmitHandler();
    this._formComponent.unsetRollUpButtonClickHandler();
  }

  _onRollUpButtonClick() {
    replace(this._pointComponent, this._formComponent);

    this._formComponent.unsetEscapeKeydownHandler();
    this._formComponent.unsetFormSubmitHandler();
    this._formComponent.unsetRollUpButtonClickHandler();
  }

  _onRollDownButtonClick() {
    replace(this._formComponent, this._pointComponent);

    this._formComponent.setFormSubmitHandler(this._onEditFromSubmit);
    this._formComponent.setEscapeKeydownHandler(this._onEscKeydown);
    this._formComponent.setRollUpButtonClickHandler(this._onRollUpButtonClick);
  }
}

export default Point;
