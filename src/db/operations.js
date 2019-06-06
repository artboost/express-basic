const { NotFoundError } = require('@artboost/http-errors');

const pool = require('./pool');

const exec = async (query, params) => {
  const conn = await pool.getConnection();

  try {
    return await conn.execute(query, params);
  } finally {
    // Release and unprepare statement after execution
    // Otherwise leaks prepared statements
    conn.release();
    conn.unprepare(query);
  }
};

async function select(query, params) {
  const [rows] = await exec(query, params);

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
  const [{ insertId, affectedRows }] = await exec(query, params);
  return { id: insertId, affectedRows };
}

async function update(query, params) {
  await exec(query, params);
}

async function del(query, params) {
  await exec(query, params);
}

module.exports = {
  select,
  selectOne,
  insert,
  update,
  delete: del,
};
