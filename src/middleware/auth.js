const jwt = require('jsonwebtoken');
const axios = require('axios');

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
      next({ status: 401 });
    } else {
      res.locals.authChecked = true;
      next();
    }
    return;
  }

  const token = authString.split(' ').pop();

  jwt.verify(token, getKey, { algorithm: ['RS256'] }, (err, decoded) => {
    if (err) {
      next({
        status: 401,
        message: err.message,
      });
      return;
    }

    const { user } = decoded;

    if (adminRequired && !user.is_admin) {
      next({
        status: 403,
        message: 'not admin',
      });
      return;
    }

    res.locals.user = user;
    res.locals.authChecked = true;

    next();
  });
};

module.exports = authMiddleware;
