const db = require('../operations');

const {
  validateColumns,
  concatColumnNames,
  filterUndefined,
} = require('../util');

class Model {
  /**
   * Getter for table name. Must be overridden.
   * @return string Table name.
   */
  static get TABLE() {
    throw new Error('Static getter TABLE is not overridden.');
  }

  /**
   * Getter for primary key. Must be overridden.
   * @return string Primary key name.
   */
  static get PRIMARY_KEY() {
    throw new Error('Static getter PRIMARY_KEY is not overridden.');
  }

  /**
   * Getter for array of column names. Must be overridden.
   * @return Array<string> Array of column names.
   */
  static get COLUMNS() {
    throw new Error('Static getter COLUMNS is not overridden.');
  }

  constructor(columns) {
    this.columns = filterUndefined(columns);
    this.changes = [];
  }

  /**
   * All rows in table.
   * @return {Promise<Array<Model|Entry>>}
   */
  static async all() {
    const rows = await db.select(`select * from ${this.TABLE}`);
    return rows.map(data => new this(data));
  }

  /**
   * Selects one row from table.
   * @param {object} columns Columns to match against in where, e.g. { id: 1 } -> where id = 1.
   * @param {string[]} include What columns to exclude, e.g. ['id'] => select `id`. Becomes * on empty.
   * @return {Promise<Model|Entry>}
   */
  static async findOne(columns, include = []) {
    const table = {
      name: this.TABLE,
      primaryKey: this.PRIMARY_KEY,
      columns: this.COLUMNS,
    };

    // Validate where clause
    const columnNames = Object.keys(columns);
    validateColumns(table, columnNames);

    // Validate columns to include
    validateColumns(table, include);

    const params = [];

    let selection;
    if (include.length > 0) {
      selection = include.map(c => `\`${c}\``).join(',');
    } else {
      selection = '*';
    }

    params.push(...Object.values(columns));

    const statement = `
      select ${selection}
      from ${this.TABLE}
      where ${concatColumnNames(columnNames)}
      limit 1;
    `;

    const data = await db.selectOne(statement, params);
    return new this(data);
  }

  /**
   * Upserts
   * @return {Promise<Model|Entry>}
   */
  async save() {
    if (this.columns[this.constructor.PRIMARY_KEY]) {
      // No changes; no need to update, premature return.
      if (this.changes.length === 0) {
        return this;
      }
      const statement = `
        update ${this.constructor.TABLE}
        set ${concatColumnNames(this.changes)}
        where \`${this.constructor.PRIMARY_KEY}\` = ?;
      `;

      const changedValues = this.changes.map(column => this.columns[column]);
      await db.update(statement, [...changedValues, this.columns[this.constructor.PRIMARY_KEY]]);

      this.changes = [];
    } else {
      const statement = `
        insert into ${this.constructor.TABLE}
        set ${concatColumnNames(Object.keys(this.columns))}   
      `;

      const { id } = await db.insert(statement, Object.values(this.columns));
      this.columns[this.constructor.PRIMARY_KEY] = id;
    }

    return this;
  }

  async delete() {
    if (!this.columns[this.constructor.PRIMARY_KEY]) {
      console.warn('Attempted to delete un-initialized category');
      return;
    }

    const statement = `
      delete from ${this.constructor.TABLE}
      where ${this.constructor.PRIMARY_KEY} = ?
    `;
    await db.delete(statement, [this.columns[this.constructor.PRIMARY_KEY]]);
  }

  /**
   * @param columns
   * @return {Model|Entry}
   */
  set(columns) {
    const table = {
      name: this.constructor.TABLE,
      primaryKey: this.constructor.PRIMARY_KEY,
      columns: this.constructor.COLUMNS,
    };

    const columnNames = Object.keys(columns);
    validateColumns(table, columnNames, true);

    columnNames.forEach((column) => {
      if (columns[column] !== this.columns[column]) {
        this.columns[column] = columns[column];
        this.changes.push(column);
      }
    });

    return this;
  }

  get(column) {
    return this.columns[column];
  }

  toJSON() {
    return { [this.constructor.PRIMARY_KEY]: this.columns[this.constructor.PRIMARY_KEY], ...this.columns };
  }
}

Model.prototype.toString = function toString() {
  return JSON.stringify(this.toJSON());
};

module.exports = Model;
