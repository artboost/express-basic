class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
    };
  }
}

class IllegalArgumentException extends HttpError {
  constructor(m = 'IllegalArgument') {
    super(m, 400);
  }
}

class UnauthorizedError extends HttpError {
  constructor(m = 'Unauthorized') {
    super(m, 401);
  }
}

class ForbiddenError extends HttpError {
  constructor(m = 'Forbidden') {
    super(m, 403);
  }
}

class NotFoundError extends HttpError {
  constructor(m = 'NotFound') {
    super(m, 404);
  }
}

class ConflictError extends HttpError {
  constructor(m = 'Conflict') {
    super(m, 409);
  }
}

class InternalServerError extends HttpError {
  constructor(m = 'Internal server error') {
    super(m, 500);
  }
}

module.exports = {
  IllegalArgumentException,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
