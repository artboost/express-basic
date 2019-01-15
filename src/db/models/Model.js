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
   * @return {Promise<Array<Model>>}
   */
  static async all() {
    const rows = await db.select(`select * from ${this.TABLE}`);
    return rows.map(data => new this(data, { isInserted: true }));
  }

  /**
   * Selects rows matching query, mapping out into array of Model.
   * @param {object} columns Columns to match against in where, e.g. { id: 1 } -> where id = 1.
   * @param {object} options
   * @param {string[]} [options.include] What columns to include, e.g. ['id'] => select `id`. Becomes * on empty.
   * @param {number} [options.limit]
   * @param {number} [options.offset]
   * @param {object} [options.order]
   * @param {string} options.order.column Column to order by
   * @param {'asc'|'desc'} [options.order.direction=asc] Sort direction
   * @return {Promise<Model>}
   */
  static async find(columns, options = {}) {
    const rows = await this._find(db.select, columns, options);
    return rows.map(data => new this(data, { isInserted: true }));
  }

  /**
   * Selects one row from table, and constructs Model from data.
   * @param {object} columns Columns to match against in where, e.g. { id: 1 } -> where id = 1.
   * @param {object} options
   * @param {string[]} options.include What columns to include, e.g. ['id'] => select `id`. Becomes * on empty.
   * @param {number} options.limit
   * @param {number} options.offset
   * @return {Promise<Model>}
   */
  static async findOne(columns, options = {}) {
    const data = await this._find(db.selectOne, columns, {
      ...options,
      limit: 1,
    });
    return new this(data, { isInserted: true });
  }

  static async _find(executor, columns, {
    include = [],
    limit = 0,
    offset = 0,
    order,
  }) {
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
      selection = include
        .map(c => `\`${c}\``)
        .join(',');
    } else {
      selection = '*';
    }

    let statement = `
      select ${selection}
      from ${this.TABLE}
    `;


    if (columnNames.length > 0) {
      statement += `\nwhere ${concatColumnNames(columnNames, 'and')}`;
      params.push(...Object.values(columns));
    }

    if (order) {
      const { column, direction = 'asc' } = order;
      statement += `\norder by \`${column}\` ${direction}`;
    }

    if (limit > 0) {
      statement += '\nlimit ?, ?';
      params.push(offset, limit);
    }

    return executor(statement, params);
  }

  /**
   * @param {object} columns
   * @param {object} [options]
   * @param {boolean} options.exists=false
   */
  constructor(columns, options = {}) {
    this.columns = columns;
    this.changes = [];
    this.options = options;
  }

  get columns() {
    return this._c;
  }

  set columns(columns) {
    validateColumns(this.table, Object.keys(columns));
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
   * @return {Model}
   */
  set(columns) {
    const filtered = filterUndefined(columns);
    const columnNames = Object.keys(filtered);
    validateColumns(this.table, columnNames, true);

    this.columns = columnNames.reduce((acc, column) => {
      if (filtered[column] !== this.get(column)) {
        this.changes.push(column);
      }

      return {
        ...acc,
        [column]: filtered[column],
      };
    }, this.columns);

    return this;
  }

  get(column) {
    if (Array.isArray(column)) {
      return column.map(c => this.columns[c]);
    }
    return this.columns[column];
  }

  /**
   * Upserts
   * @return {Promise<Model>}
   */
  save() {
    if (!this.options.isInserted) {
      return this._insert();
    }

    return this._update();
  }

  async _insert() {
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

    this.options.isInserted = true;

    return this;
  }

  async _update() {
    // No changes; no need to update, premature return.
    if (this.changes.length === 0) {
      return this;
    }

    let statement = `
        update \`${this.table.name}\`
        set ${concatColumnNames(this.changes)}
      `;

    const params = [...this.changes.map(column => this.get(column))];

    if (Array.isArray(this.table.primaryKey)) {
      statement += `where ${concatColumnNames(this.table.primaryKey, 'and ')}`;
      params.push(...this.primaryKey);
    } else {
      statement += `where \`${this.table.primaryKey}\` = ?`;
      params.push(this.primaryKey);
    }
    await db.update(statement, params);

    this.changes = [];

    return this;
  }

  async delete() {
    if (!this.options.isInserted) {
      console.warn('Attempted to delete un-initialized category');
      return;
    }

    let statement = `delete from ${this.table.name}`;

    const params = [];

    if (Array.isArray(this.table.primaryKey)) {
      statement += `\nwhere ${concatColumnNames(this.table.primaryKey, 'and ')}`;
      params.push(...this.primaryKey);
    } else {
      statement += `\nwhere \`${this.table.primaryKey}\` = ?`;
      params.push(this.primaryKey);
    }

    await db.delete(statement, params);

    this.options.isInserted = false;
  }

  toJSON() {
    return { ...this.columns };
  }
}

Model.prototype.toString = function toString() {
  return JSON.stringify(this.toJSON());
};

module.exports = Model;
