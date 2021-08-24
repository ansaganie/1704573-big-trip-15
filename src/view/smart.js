import Abstract from './abstract';

class Smart extends Abstract {
  constructor() {
    if (new.target === Smart) {
      throw new Error('Can\'t instantiate Smart, only concrete one.');
    }

    super();
    this._state = {};
  }

  updateState(updatedState, noRendering) {
    if (!updatedState) {
      return;
    }

    this._state = {
      ...this._state,
      ...updatedState,
    };

    if (noRendering) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method should be realized');
  }
}

export default Smart;
