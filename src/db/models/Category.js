const Model = require('./Model');

class Category extends Model {
  static get TABLE() {
    return 'category';
  }

  static get PRIMARY_KEY() {
    return 'id';
  }

  static get COLUMNS() {
    return [
      'id',
      'label',
    ];
  }

  get id() {
    return this.get('id');
  }

  get label() {
    return this.get('label');
  }

  set label(label) {
    return this.set({ label });
  }
}

module.exports = Category;
