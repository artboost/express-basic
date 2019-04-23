const { NotFoundError } = require('@artboost/http-errors');

const pool = require('./pool');

async function select(query, params) {
  const [rows] = await pool.execute(query, params);

  return rows;
}

async function selectOne(query, params) {
  const rows = await select(query, params);
  if (rows.length > 1) {
    throw new Error('Multiple rows found, expected only one.');
  }

  if (rows.length === 0) {
    throw new NotFoundError();
  }

  return rows[0];
}

async function insert(query, params) {
  const [{ insertId, affectedRows }] = await pool.execute(query, params);
  return { id: insertId, affectedRows };
}

async function update(query, params) {
  await pool.execute(query, params);
}

async function del(query, params) {
  await pool.execute(query, params);
}

module.exports = {
  select,
  selectOne,
  insert,
  update,
  delete: del,
};
