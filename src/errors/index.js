class IllegalArgumentException extends Error {
  constructor(m = 'IllegalArgument') {
    super(m);
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(m = 'Unauthorized') {
    super(m);
    this.status = 401;
  }
}

class ForbiddenError extends Error {
  constructor(m = 'Forbidden') {
    super(m);
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(m = 'NotFound') {
    super(m);
    this.status = 404;
  }
}

class InternalServerError extends Error {
  constructor(m = 'Internal server error') {
    super(m);
    this.status = 500;
  }
}

module.exports = {
  IllegalArgumentException,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
