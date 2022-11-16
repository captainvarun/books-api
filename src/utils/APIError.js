class APIError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super();
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = APIError;
