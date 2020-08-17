import TextArea from './TextArea';
import VirtualKeyboard from './VirtualKeyboard';


export default class KeyboardLayout {
  constructor(target, container, searchBtn) {
    const contentWrapper = document.createElement('div');
    const keyboard = document.createElement('div');
    const keyboardKeys = document.createElement('div');

    this.container = container;
    contentWrapper.classList.add('content-wrapper');
    keyboard.classList.add('keyboard');
    keyboardKeys.classList.add('keyboard__keys');

    this.container.append(contentWrapper);
    contentWrapper.appendChild(keyboard);
    keyboard.appendChild(keyboardKeys);

    this.output = new TextArea(target);
    this.input = new VirtualKeyboard(keyboard, this.output, keyboardKeys, searchBtn);
    this.loadstorage();
  }

  loadstorage() {
    window.onbeforeunload = () => {
      const currentLang = this.input.getCurrentLang;
      localStorage.setItem('lang', currentLang);
    };

    window.onload = () => {
      const lang = localStorage.getItem('lang');
      if (lang !== null) { this.input.changeLang(lang); }
    };
  }

  toggle(flag) {
    if (!flag) {
      this.container.style.display = 'none';
      this.output.element.onblur = () => {};
    } else {
      this.container.style.display = 'block';
      this.output.element.onblur = function () { this.focus(); };
    }
  }
}
