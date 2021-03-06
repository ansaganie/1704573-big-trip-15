const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message, addClassName) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  if (addClassName) {
    toastItem.classList.add(addClassName);
  }

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export { toast };
