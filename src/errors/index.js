class NotFoundError extends Error {
  constructor(m = 'Not found.') {
    super(m);
    this.status = 404;
  }
}

class IllegalArgumentException extends Error {
  constructor(m = 'Illegal argument.') {
    super(m);
    this.status = 400;
  }
}
module.exports = {
  NotFoundError,
  IllegalArgumentException,
};
