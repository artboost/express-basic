const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors');

const getKey = require('./getKey');

const authenticate = token => new Promise((resolve, reject) => {
  jwt.verify(token, getKey, (err, decoded) => {
    if (err) {
      reject(new UnauthorizedError(`Bearer, error="invalid_token", error_description="${err.message}"`));
    } else {
      resolve(decoded.user);
    }
  });
});

module.exports = authenticate;
