/* global Flickity */

import ApiManager from './ApiManager';
import Card from './Card';
import KeyboardLayout from './keyboard/KeyboardLayout';

export default class Layout {
  constructor() {
    this.searchButton = document.querySelector('.search-btn');
    this.keyboardButton = document.querySelector('.search-tia');
    this.clearButton = document.querySelector('.search-clear');
    this.searchInput = document.querySelector('.search-input');
    this.carouselContainer = document.querySelector('.carousel-container');
    this.cardsWrapper = document.querySelector('.carousel');
    this.alertContainer = document.querySelector('.alert-container');
    this.keyboardContainer = document.querySelector('.keyboard-container');
    this.fragment = document.createDocumentFragment();

    this.isKeyboardEnabled = false;

    this.apiManager = new ApiManager(this);
    this.keyboardLayout = new KeyboardLayout(this.searchInput,
      this.keyboardContainer, this.searchButton);

    this.bindButtons();
  }

  bindButtons() {
    this.searchButton.onclick = () => this.apiManager.search(this.searchInput.value);
    this.clearButton.onclick = () => this.clearInput();
    this.keyboardButton.onclick = () => this.toggleKeyboard();

    this.searchInput.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        this.searchButton.click();
      }
    });
  }

  createMovieCards(arrayMovies) {
    this.carouselContainer.innerHTML = '<div class="carousel"></div>';
    this.cardsWrapper = document.querySelector('.carousel');

    for (let i = 0; i < arrayMovies.length; i += 1) {
      const card = new Card(arrayMovies[i]);
      this.fragment.appendChild(card.render());
    }
    this.cardsWrapper.appendChild(this.fragment);
    // eslint-disable-next-line no-new
    new Flickity(this.cardsWrapper, { wrapAround: true });
  }

  clearInput() {
    this.searchInput.value = '';
  }

  showAlert(message, type = 'danger') {
    this.alertContainer.innerHTML = `
      <div class="alert alert-${type}" role="alert">
          ${message}
      </div>
    `;
  }

  toggleLoading(flag) {
    this.alertContainer.innerHTML = flag ? '<div class="loader">Loading...</div>' : '';
  }

  toggleKeyboard() {
    this.isKeyboardEnabled = !this.isKeyboardEnabled;
    this.keyboardLayout.toggle(this.isKeyboardEnabled);
  }
}
