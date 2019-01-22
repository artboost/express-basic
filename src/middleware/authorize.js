const authenticate = require('../auth');

const {
  UnauthorizedError,
  ForbiddenError,
} = require('../errors');

const types = {
  OPTIONAL: 'optional',
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
  SERVICE: 'service',
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

  authenticate(token).then((payload) => {
    if (requiredType === types.SERVICE) {
      if (payload.type === 'service') {
        res.locals.service = payload.service;
      } else {
        throw new ForbiddenError('Bearer, error=insufficient_scope, error_description="Service only."');
      }
    } else {
      const { user } = payload;
      if (requiredType === types.USER && user.type === 'guest') {
        throw new ForbiddenError('Bearer, error="insufficient_scope", error_description="Guests not allowed; must be a registered user."');
      }

      if (requiredType === types.ADMIN && user.type !== 'admin') {
        throw new ForbiddenError('Bearer, error=insufficient_scope, error_description="Admins only."');
      }

      res.locals.user = user;
    }
  }).then(() => {
    res.locals.jwt = token;
    next();
  }).catch((err) => {
    res.setHeader('WWW-Authenticate', err.message);
    next(err);
  });
};

module.exports = {
  optional: authorize(),
  guest: authorize(types.GUEST),
  user: authorize(types.USER),
  admin: authorize(types.ADMIN),
  service: authorize(types.SERVICE),
};
