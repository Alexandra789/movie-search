const API_URL = 'https://www.omdbapi.com';
const API_KEY = '3fd78803';
const TRANSLATE_API_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const TRANSLATE_API_KEY = 'trnsl.1.1.20200510T194254Z.b046f9694243c5b6.b480132b21798745a66db43c42c8256409090f2c';
const TITLES = ['batman', 'harry potter', 'star wars', 'tokyo', 'I am'];

function getRatings(data) {
  return Promise.all(data.map((entry) => {
    const url = `${API_URL}/?i=${entry.imdbID}&apikey=${API_KEY}`;
    return fetch(url).then((res) => res.json());
  }));
}

function getRandomTitle() {
  return TITLES[Math.floor(Math.random() * TITLES.length)];
}

function hasCyrillic(text) {
  return /[а-яА-ЯЁё]/.test(text);
}

async function translateRuEn(text) {
  const url = `${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}&text=${text}&lang=ru-en`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.text[0];
}
export default class ApiManager {
  constructor(layout) {
    this.layout = layout;
    this.search(getRandomTitle());
  }

  async search(query) {
    let translated = '';
    let translatedQuery = query;
    if (hasCyrillic(query)) {
      translatedQuery = await translateRuEn(translatedQuery);
      translated = ' (translated)';
    }

    const url = `${API_URL}/?s=${translatedQuery}&apikey=${API_KEY}&type=movie`;
    this.layout.toggleLoading(true);
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.Search) {
          this.layout.showAlert(`No results for "${translatedQuery}"${translated}`);
        } else {
          const result = data.Search;
          getRatings(result).then((res) => {
            for (let i = 0; i < res.length; i += 1) {
              result[i].rating = res[i].imdbRating;
            }
            if (translated) {
              this.layout.showAlert(`Results for "${translatedQuery}" (translated)`, 'success');
            } else {
              this.layout.toggleLoading(false);
            }
            this.layout.createMovieCards(result);
          });
        }
      })
      .catch((err) => {
        this.layout.showAlert(err);
      });
  }
}
