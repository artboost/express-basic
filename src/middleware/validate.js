const { validate } = require('express-model-validator');

const { BadRequestError } = require('../errors');

const keyValidator = (object = {}, required, next) => {
  const keys = Object.keys(object);

  const missing = required.filter(column => keys.indexOf(column) === -1);
  if (missing.length > 0) {
    next({ status: 400, message: `Invalid body. Missing: ${missing}` });
  } else {
    next();
  }
};

// As Express middleware
const validateMiddleware = model => (req, res, next) => {
  if (validate(model, req.body)) {
    next();
  } else {
    next(new BadRequestError(`Invalid body.\nExpected model: { ${Object.keys(model).join(', ')} }`));
  }
};

module.exports = {
  key: {
    body: required => (req, res, next) => keyValidator(req.body, required, next),
    query: required => (req, res, next) => keyValidator(req.query, required, next),
  },
  model: validateMiddleware,
};
