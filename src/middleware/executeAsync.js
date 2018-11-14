// For use with async functions, negating mandatory use of try/catch.
module.exports = fn => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
};
