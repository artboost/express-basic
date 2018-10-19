const authorize = require('./auth');

// For use with async functions, negating mandatory use of try/catch.
const executeAsync = fn => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

const validate = (object = {}, required, next) => {
  const keys = Object.keys(object);

  const missing = required.filter(column => keys.indexOf(column) === -1);
  if (missing.length > 0) {
    next({ status: 400, message: `Invalid body. Missing: ${missing}` });
  } else {
    next();
  }
};

module.exports.executeAsync = executeAsync;
module.exports.validate = {
  body: required => (req, res, next) => validate(req.body, required, next),
  query: required => (req, res, next) => validate(req.query, required, next),
};

module.exports.authorize = {
  admin: authorize(true, true),
  user: authorize(true),
  optional: authorize(),
};
