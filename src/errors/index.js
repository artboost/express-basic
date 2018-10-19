class NotFoundError extends Error {
  constructor(m = 'Not found.') {
    super(m);
    this.status = 404;
  }
}

module.exports = {
  NotFoundError,
};
