const cacheMiddleware = (duration, cacheability = 'public') => (req, res, next) => {
  res.set('Cache-Control', `${cacheability}, max-age=${duration}`);
  next();
};

const seconds = cacheMiddleware;
const minutes = (m, ...args) => seconds(60 * m, ...args);
const hours = (h, ...args) => minutes(60 * h, ...args);
const days = (d, ...args) => hours(24 * d, ...args);
const years = (y, ...args) => days(365 * y, ...args);

module.exports = {
  seconds,
  minutes,
  hours,
  days,
  years,
};
