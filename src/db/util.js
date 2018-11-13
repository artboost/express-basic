const { BadRequestError } = require('../errors');

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
    const isPrimaryKey = Array.isArray(table.primaryKey)
      ? column => table.primaryKey.some(pk => column === pk)
      : column => column === table.primaryKey;
    if (columns.some(isPrimaryKey)) {
      throw new BadRequestError('Primary key is immutable.');
    }
  }

  const invalidColumns = columns.filter(column => !table.columns.some(valid => column === valid));
  if (invalidColumns.length > 0) {
    const msg = `Table \`${table.name}\` does not have any such column.
Invalid: ${invalidColumns}.
Valid: ${table.columns}`;
    throw new BadRequestError(msg);
  }
};

/**
 * Returns escaped and concatenated column names, fencepost-ed with = ? at the end.
 * E.g. columns: ['uri', 'label'] -> `uri` = ?, `label` = ?
 *
 * Returns empty string on empty array.
 * @param {Array<string>} columns
 * @param glue
 * @return {string}
 */
const concatColumnNames = (columns, glue = ',') => {
  if (columns.length <= 0) {
    return '';
  }

  return `${columns.map(column => `\`${column}\``).join(` = ? ${glue}`)} = ?`;
};

// Removes undefined undefined values in obj.
const filterUndefined = obj => Object.keys(obj)
  .filter(key => typeof obj[key] !== 'undefined')
  .reduce((acc, key) => ({
    ...acc,
    [key]: obj[key],
  }), {});

module.exports = {
  validateColumns,
  concatColumnNames,
  filterUndefined,
};
