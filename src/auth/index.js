const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('@artboost/http-errors');

const getKey = require('./getKey');

const authenticate = token => new Promise((resolve, reject) => {
  jwt.verify(token, getKey, (err, payload) => {
    if (err) {
      reject(new UnauthorizedError(`Bearer, error="invalid_token", error_description="${err.message}"`));
    } else {
      resolve(payload);
    }
  });
});

module.exports = authenticate;
