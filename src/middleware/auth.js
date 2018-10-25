const jwt = require('jsonwebtoken');
const axios = require('axios');

const {
  UnauthorizedError,
  ForbiddenError,
} = require('../errors');

const getKey = (header, callback) => {
  const keyPath = process.env.KEY_PATH || 'https://example.org/key.pub';
  axios.get(keyPath)
    .then(res => callback(null, res.data))
    .catch(err => callback(err));
};

const authMiddleware = (required = false, adminRequired = false) => (req, res, next) => {
  if (res.locals.authChecked) {
    next();
    return;
  }

  const authString = req.get('authorization');
  if (!authString) {
    if (required) {
      next(new UnauthorizedError());
    } else {
      res.locals.authChecked = true;
      next();
    }
    return;
  }

  const token = authString.split(' ').pop();

  jwt.verify(token, getKey, { algorithm: ['RS256'] }, (err, decoded) => {
    if (err) {
      next(new UnauthorizedError(err.message));
      return;
    }

    const { user } = decoded;

    if (adminRequired && !user.is_admin) {
      next(new ForbiddenError('Not admin'));
      return;
    }

    res.locals.user = user;
    res.locals.authChecked = true;

    next();
  });
};

module.exports = authMiddleware;
