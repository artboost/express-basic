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

  authenticate(token).then((user) => {
    if (requiredType === types.USER && user.is_guest) {
      throw new ForbiddenError('Bearer, error="insufficient_scope", error_description="Guests not allowed; must be a registered user."');
    }

    if (requiredType === types.ADMIN && !user.is_admin) {
      throw new ForbiddenError('Bearer, error=insufficient_scope, error_description="Admins only."');
    }

    return user;
  }).then((user) => {
    res.locals.user = user;
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
};
