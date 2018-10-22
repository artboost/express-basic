const Model = require('./Model');

class Entry extends Model {
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
      'category_id',
    ];
  }

  get id() {
    return this.get('id');
  }

  get message() {
    return this.get('message');
  }

  get category_id() {
    return this.get('category_id');
  }

  set message(message) {
    return this.set({ message });
  }

  set category_id(id) {
    return this.set({ category_id: id });
  }
}

module.exports = Entry;
