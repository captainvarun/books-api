const APIError = require('../utils/APIError.js');
const httpStatus = require('http-status');
const config = require('../config/index.js');
const mongoose = require('mongoose');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof APIError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];

    error = new APIError(statusCode, message, false, err.stack);
  }

  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  // if (config.env === 'development') logger.error(err);

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
