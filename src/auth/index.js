const jwt = require('jsonwebtoken');
const axios = require('axios');

const { UnauthorizedError } = require('../errors');

const getKey = (header, callback) => {
  const keyPath = process.env.KEY_PATH;
  axios.get(keyPath)
    .then(res => callback(null, res.data))
    .catch(err => callback(err));
};

const authenticate = token => new Promise((resolve, reject) => {
  jwt.verify(token, getKey, { algorithm: ['RS256'] }, (err, decoded) => {
    if (err) {
      reject(new UnauthorizedError(`Bearer, error="invalid_token", error_description="${err.message}"`));
    } else {
      resolve(decoded.user);
    }
  });
});

module.exports = authenticate;
