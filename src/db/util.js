const { IllegalArgumentException } = require('../errors');

/**
 *
 * @param {{
 *  name: string,
 *  primaryKey: string,
 *  columns: Array<string>
 * }} table
 * @param {Array<string>} columns
 * @param {boolean} forUpdate Throws error if primary key is in columns, as it is immutable.
 */
const validateColumns = (table, columns, forUpdate = false) => {
  if (forUpdate) {
    if (columns.some(column => column === table.primaryKey)) {
      throw new IllegalArgumentException('Primary key is immutable.');
    }
  }

  const invalidColumns = columns.filter(column => !table.columns.some(valid => column === valid));
  if (invalidColumns.length > 0) {
    const msg = `Table \`${table.name}\` does not have any such column.
Invalid: ${invalidColumns}.
Valid: ${table.columns}`;
    throw new IllegalArgumentException(msg);
  }
};

/**
 * Returns escaped and concatenated column names, fencepost-ed with = ? at the end.
 * E.g. columns: ['uri', 'label'] -> `uri` = ?, `label` = ?
 *
 * Returns empty string on empty array.
 * @param {Array<string>} columns
 * @return {string}
 */
const concatColumnNames = (columns) => {
  if (columns.length <= 0) {
    return '';
  }

  return `${columns.map(column => `\`${column}\``).join(' = ?, ')} = ?`;
};

// Escapes null values in obj to null.
const nullEscape = obj => Object.keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    [key]: obj[key] || null,
  }), {});

module.exports = {
  validateColumns,
  concatColumnNames,
  nullEscape,
};
