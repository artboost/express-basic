const errors = require('@artboost/http-errors');

/**
 * @param e
 * @return {HttpError}
 */
function parseError(e) {
  const msg = e.data.message || e.statusText;
  switch (e.status) {
    case 400:
      return new errors.BadRequestError(msg);
    case 401:
      return new errors.UnauthorizedError(msg);
    case 403:
      return new errors.ForbiddenError(msg);
    case 404:
      return new errors.NotFoundError(msg);
    case 409:
      return new errors.ConflictError(msg);
    case 500:
    default:
      return new errors.InternalServerError(msg);
  }
}

/**
 * @param {Promise<AxiosResponse>} request
 */
async function executeRequest(request) {
  try {
    const response = await request;
    return response.data;
  } catch (e) {
    throw parseError(e.response);
  }
}

module.exports.executeRequest = executeRequest;
