const { BaseModel } = require('./BaseModel');

class Entry extends BaseModel {
  static get TABLE() {
    return 'entry';
  }

  static get PRIMARY_KEY() {
    return 'id';
  }

  static get COLUMNS() {
    return [
      'id',
      'message',
    ];
  }

  get id() {
    return this.get('id');
  }

  get message() {
    return this.get('message');
  }

  set message(message) {
    return this.set({ message });
  }
}

module.exports = Entry;
