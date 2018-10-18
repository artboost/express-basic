const mysql = require('mysql2/promise');

const {
  DB_HOST: host,
  DB_PORT: port,
  DB_USER: user,
  DB_PASS: password,
  DB_NAME: database,
} = process.env;

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
});

module.exports = pool;
