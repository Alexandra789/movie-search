export default class TextArea {
  constructor(element) {
    this.element = element;
  }

  printLetter(letter) {
    if (!letter) {
      return;
    }
    const caretPos = this.element.selectionStart;
    const text = this.element.value;
    this.element.value = `${text.slice(0, caretPos)}${letter}${text.slice(caretPos)}`;
    this.element.selectionStart = caretPos + 1;
    this.element.selectionEnd = this.element.selectionStart;
  }

  eraseLetter() {
    const caretPos = this.element.selectionStart;
    const text = this.element.value;
    this.element.value = text.slice(0, caretPos - 1) + text.slice(caretPos);
    this.element.selectionStart = caretPos - 1;
    this.element.selectionEnd = this.element.selectionStart;
  }

  deleteNextLetter() {
    const caretPos = this.element.selectionStart;
    const text = this.element.value;
    this.element.value = text.slice(0, caretPos) + text.slice(caretPos + 1);
    this.element.selectionStart = caretPos;
  }

  moveCaret(delta) {
    this.element.selectionStart += delta;
    this.element.selectionEnd = this.element.selectionStart;
  }
}
