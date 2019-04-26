/* eslint-disable no-shadow */
import startGame from './game';

// popup
const popupElement = document.getElementById('popup');
const formElement = document.getElementById('name-form');
const inputElement = document.getElementById('name-field');
inputElement.focus();
formElement.addEventListener('submit', evt => {
  evt.preventDefault();
  const name = evt.target.name.value;
  if (name) {
    popupElement.style.display = 'none';
    startGame(name);
  }
});
