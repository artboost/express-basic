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

class ForbiddenError extends Error {
  constructor(m = 'Forbidden') {
    super(m);
    this.status = 403;
  }
}

module.exports = {
  NotFoundError,
  IllegalArgumentException,
  ForbiddenError,
};
