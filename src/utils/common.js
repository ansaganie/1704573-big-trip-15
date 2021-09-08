export const isEscapePressed = (evt) =>
  evt.key === 'Escape' || evt.key === 'Esc';

export const isOnline = () => window.navigator.onLine;
