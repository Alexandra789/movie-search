const TITLE_URL = 'https://www.imdb.com/title/';

export default class Card {
  constructor(data) {
    this.title = data.Title;
    this.poster = data.Poster;
    this.year = data.Year;
    this.id = data.imdbID;
    this.rating = data.rating;
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('card');
    element.classList.add('carousel-cell');
    element.innerHTML = `
        <img class="card-img-top" src="${this.poster}" alt="movie poster"
        onerror="this.onerror=null; this.src='assets/images/no-poster.png'"/>
        <div class="card-body">
            <a class="card-title" href="${TITLE_URL}${this.id}">${this.title}</a>
            <p class="card-info">${this.year} <span class="card-rating">&#128970;${this.rating}</span></p>
        </div>`;
    return element;
  }
}
