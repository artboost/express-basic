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

const types = {
  OPTIONAL: 'optional',
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
};

const authorize = (requiredType = types.OPTIONAL) => (req, res, next) => {
  if (res.locals.authChecked) {
    next();
    return;
  }

  res.locals.authChecked = true;

  const authString = req.get('authorization');
  if (!authString) {
    if (requiredType !== types.OPTIONAL) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      next(new UnauthorizedError());
    } else {
      next();
    }
    return;
  }

  const token = authString.split(' ').pop();

  jwt.verify(token, getKey, { algorithm: ['RS256'] }, (err, decoded) => {
    if (err) {
      res.setHeader('WWW-Authenticate', `Bearer, error="invalid_token", error_description="${err.message}"`);
      next(new UnauthorizedError(err.message));
      return;
    }

    const { user } = decoded;

    if (requiredType === types.USER && user.is_guest) {
      res.setHeader('WWW-Authenticate', 'Bearer, error="insufficient_scope", error_description="Guests not allowed; must be a registered user."');
      next(new ForbiddenError());
      return;
    }

    if (requiredType === types.ADMIN && !user.is_admin) {
      res.setHeader('WWW-Authenticate', 'Bearer, error=insufficient_scope, error_description="Admins only."');
      next(new ForbiddenError());
      return;
    }

    res.locals.user = user;

    next();
  });
};

module.exports = {
  optional: authorize(),
  guest: authorize(types.GUEST),
  user: authorize(types.USER),
  admin: authorize(types.ADMIN),
};
