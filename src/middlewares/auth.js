const httpStatus = require('http-status');
const passport = require('passport');
const APIError = require('../utils/APIError.js');

const verifyCallback = (req, resolve, reject, requiredRole) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new APIError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }

  req.user = user;

  if (requiredRole === 'admin' && user.role !== requiredRole)
    return reject(new APIError(httpStatus.FORBIDDEN, 'Forbidden'));

  resolve();
};

const authMiddleware = (requiredRole) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRole))(
      req,
      res,
      next,
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = authMiddleware;
