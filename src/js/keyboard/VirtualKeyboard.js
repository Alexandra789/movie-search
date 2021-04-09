/* global KEY_MAP, SHIFT_KEYS,  */
export default class VirtualKeyboard {
  constructor(element, target, keys, searchBtn) {
    this.element = element;
    this.target = target;
    this.keys = keys;
    this.currentLang = 'ru';
    this.upperCase = false;
    this.shifted = false;
    this.searchBtn = searchBtn;
    this.pressedKeys = [];

    this.createKeyboard();
    this.bindMouseClicks();
  }

  get getCurrentLang() { return this.currentLang; }

  keyboardClickButton(e) {
    e.preventDefault();
    const keyboardKey = document.querySelectorAll('.keyboard__key');
    for (let i = 0; i < keyboardKey.length; i++) {
      let code = e.keyCode;
      if (e.location === 2) {
        code = -code;
      }
      if (code === Number(keyboardKey[i].value)) {
        keyboardKey[i].classList.add('active');
      }
    }

    if (e.keyCode === 16) {
      this.toggleShift(true);
    }

    if (!this.pressedKeys.includes(e.keyCode)) {
      this.pressedKeys.push(e.keyCode);
    }

    this.handleKeyPress(e.keyCode, e.location);
    this.checkKeyCombinations();
  }

  keyboardReleaseButton(e) {
    e.preventDefault();
    const keyboardKey = document.querySelectorAll('.keyboard__key');
    for (let i = 0; i < keyboardKey.length; i++) {
      let code = e.keyCode;
      if (e.location === 2) {
        code = -code;
      }
      if (code === Number(keyboardKey[i].value)) {
        keyboardKey[i].classList.remove('active');
      }
    }

    if (e.keyCode === 16) {
      this.toggleShift(false);
    }

    const index = this.pressedKeys.indexOf(e.keyCode);
    if (index !== -1) this.pressedKeys.splice(index, 1);
  }

  handleKeyPress(keyCode) {
    if (keyCode in SPECIAL_KEYS) {
      this.handleSpecialKey(keyCode);
    } else if (this.shifted && keyCode in SHIFT_KEYS[this.currentLang]) {
      this.target.printLetter(SHIFT_KEYS[this.currentLang][keyCode]);
    } else {
      let letter = KEY_LAYOUTS[this.currentLang][keyCode];
      if (this.upperCase != this.shifted) {
        letter = letter.toUpperCase();
      }
      this.target.printLetter(letter);
    }
  }

  handleSpecialKey(key) {
    switch (key) {
      case 32: {
        this.target.printLetter(' ');
        break;
      };
      case 8: {
        this.target.eraseLetter();
        break;
      };
      case 20: {
        this.toggleCaps();
        break;
      };
      case 37: {
        this.target.moveCaret(-1);
        break;
      };
      case 39: {
        this.target.moveCaret(1);
        break;
      };
      case 91: {
        this.switchLang();;
        break;
      };
      case 9: {
        this.target.printLetter('\t');
        break;
      };
      case 13: {
        this.searchBtn.click();;
        break;
      };
      case 46: {
        this.target.deleteNextLetter();
        break;
      };
    }
  }

checkKeyCombinations() {
  if (this.pressedKeys.length === 2
    && this.pressedKeys.includes(16)
    && this.pressedKeys.includes(18)) {
    this.switchLang();
  }
}

toggleCaps() {
  this.upperCase = !this.upperCase;
  this.rewriteKeyboard();
}

toggleShift(toggle) {
  if (this.shifted === this.toggle) {
    return;
  }
  this.shifted = toggle;
  this.rewriteKeyboard();
}

switchLang() {
  let nextLang;
  const index = LANGS.indexOf(this.currentLang);
  if (index >= LANGS.length - 1) {
    nextLang = LANGS[0];
  } else {
    nextLang = LANGS[index + 1];
  }
  this.changeLang(nextLang);
}

changeLang(lang) {
  this.currentLang = lang;
  this.rewriteKeyboard();
}

rewriteKeyboard() {
  const keyboardKey = document.querySelectorAll('.keyboard__key');
  for (let i = 0; i < keyboardKey.length; i++) {
    const keyCode = keyboardKey[i].value;
    keyboardKey[i].innerText = KEY_LAYOUTS[this.currentLang][keyCode];

    if (!(keyCode in SPECIAL_KEYS)) {
      if (this.shifted && keyCode in SHIFT_KEYS[this.currentLang]) {
        keyboardKey[i].innerText = SHIFT_KEYS[this.currentLang][keyCode];
      }

      if (this.upperCase != this.shifted) {
        keyboardKey[i].innerText = keyboardKey[i].innerText.toUpperCase();
      }
    }
  }
}

bindMouseClicks(){
  this.element.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      if (!(e.target.value in SPECIAL_KEYS)) {
        this.target.printLetter(e.target.innerText);
      } else {
        this.handleSpecialKey(Number(e.target.value));
      }
    }
  })
}

createButton(keyCode, lang) {
  const keyboardKey = document.createElement('button');
  keyboardKey.classList.add('keyboard__key');
  keyboardKey.type = 'button';
  keyboardKey.value = keyCode;
  keyboardKey.innerText = KEY_LAYOUTS[lang][keyCode];

  if (keyCode in SPECIAL_KEYS) {
    keyboardKey.classList.add(`${SPECIAL_KEYS[keyCode]}`);
  }

  return keyboardKey;
}

createKeyboard() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < KEY_MAP.length; i += 1) {
    fragment.appendChild(
      this.createButton(KEY_MAP[i], this.currentLang),
    );
  }
  this.keys.appendChild(fragment);
}
}
