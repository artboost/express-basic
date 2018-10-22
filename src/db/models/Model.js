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
   * @param {object} options
   * @param {string[]} options.include What columns to exclude, e.g. ['id'] => select `id`. Becomes * on empty.
   * @param {number} options.limit
   * @param {number} options.offset
   * @return {Promise<Model|Entry>}
   */
  static async find(columns, { include = [], limit = 0, offset = 0 } = {}) {
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

    let limitStatement;
    if (limit > 0) {
      limitStatement = 'limit ?, ?';
      params.push(offset, limit);
    } else {
      limitStatement = '';
    }

    const statement = `
      select ${selection}
      from ${this.TABLE}
      where ${concatColumnNames(columnNames)}
      ${limitStatement}
    `;

    const select = limit === 1 ? db.selectOne : db.select;
    const data = await select(statement, params);
    return new this(data);
  }

  static async findOne(columns, options) {
    return this.find(columns, { ...options, limit: 1 });
  }

  constructor(columns) {
    this.columns = columns;
    this.changes = [];
  }

  get columns() {
    // eslint-disable-next-line no-underscore-dangle
    return this._c;
  }

  set columns(columns) {
    validateColumns(this.table, Object.keys(columns));
    // eslint-disable-next-line no-underscore-dangle
    this._c = filterUndefined(columns);
  }

  get table() {
    return {
      name: this.constructor.TABLE,
      primaryKey: this.constructor.PRIMARY_KEY,
      columns: this.constructor.COLUMNS,
    };
  }

  get primaryKey() {
    return this.get(this.table.primaryKey);
  }

  /**
   * @param columns
   * @return {Model|Entry}
   */
  set(columns) {
    const columnNames = Object.keys(columns);
    validateColumns(this.table, columnNames, true);

    this.columns = columnNames.reduce((acc, column) => {
      if (columns[column] !== this.get(column)) {
        this.changes.push(column);
      }

      return {
        ...acc,
        [column]: columns[column],
      };
    }, this.columns);

    return this;
  }

  get(column) {
    return this.columns[column];
  }

  /**
   * Upserts
   * @return {Promise<Model|Entry>}
   */
  async save() {
    if (this.primaryKey) {
      // No changes; no need to update, premature return.
      if (this.changes.length === 0) {
        return this;
      }
      const statement = `
        update \`${this.table.name}\`
        set ${concatColumnNames(this.changes)}
        where \`${this.table.primaryKey}\` = ?;
      `;

      await db.update(statement, [...this.changes.map(column => this.get(column)), this.primaryKey]);

      this.changes = [];
    } else {
      const statement = `
        insert into ${this.table.name}
        set ${concatColumnNames(Object.keys(this.columns))}   
      `;

      const { id } = await db.insert(statement, Object.values(this.columns));

      // Auto-incremented primary key was inserted.
      // Select data using it.
      // This initializes defaults from DB and shit.
      if (id > 0) {
        try {
          const { columns } = await this.constructor.findOne({ id });
          this.columns = columns;
        } catch (e) {
          console.warn('Could not re-init after insert.', e);
        }
      }
    }

    return this;
  }

  async delete() {
    if (!this.primaryKey) {
      console.warn('Attempted to delete un-initialized category');
      return;
    }

    const statement = `
      delete from ${this.table.name}
      where ${this.table.primaryKey} = ?
    `;
    await db.delete(statement, [this.primaryKey]);
  }

  toJSON() {
    return { [this.table.primaryKey]: this.primaryKey, ...this.columns };
  }
}

Model.prototype.toString = function toString() {
  return JSON.stringify(this.toJSON());
};

module.exports = Model;
