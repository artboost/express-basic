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

class BadRequestError extends HttpError {
  constructor(m = 'Bad Request') {
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
  constructor(m = 'Not Found') {
    super(m, 404);
  }
}

class ConflictError extends HttpError {
  constructor(m = 'Conflict') {
    super(m, 409);
  }
}

class InternalServerError extends HttpError {
  constructor(m = 'Internal Server Error') {
    super(m, 500);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
