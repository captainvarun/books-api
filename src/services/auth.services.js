const httpStatus = require('http-status');
const APIError = require('../utils/APIError.js');
const { getUserByEmail } = require('./user.services.js');

const login = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password)))
    throw new APIError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

  return user.toJSON({ transform: true });
};

module.exports = {
  login,
};
