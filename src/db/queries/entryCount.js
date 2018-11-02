const { selectOne } = require('../operations');

module.exports = async function entryCount() {
  const { count } = await selectOne('select count(id) count from entry;');
  return count;
};
