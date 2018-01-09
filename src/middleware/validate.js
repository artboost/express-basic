const validate = (object = {}, required, next) => {
  const keys = Object.keys(object);

  const missing = required.filter(column => keys.indexOf(column) === -1);
  if (missing.length > 0) {
    next({ status: 400, message: `Invalid body. Missing: ${missing}` });
  } else {
    next();
  }
};

module.exports.body = required => (req, res, next) => validate(req.body, required, next);
module.exports.query = required => (req, res, next) => validate(req.query, required, next);
