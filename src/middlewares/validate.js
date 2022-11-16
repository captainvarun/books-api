const httpStatus = require('http-status');
const Joi = require('joi');
const APIError = require('../utils/APIError.js');

const validate = (schema) => (req, res, next) => {
  const validSchema = sort(schema, ['params', 'query', 'body']);
  const object = sort(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new APIError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);
  return next();
};

const sort = (object, keys) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});

module.exports = validate;
