const crypto = require('crypto');

module.exports = function randomString(length) {
  if (length % 2 !== 0) {
    throw new Error('Length must be even');
  }
  return crypto.randomBytes(length / 2).toString('hex');
};
