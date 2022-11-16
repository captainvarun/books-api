const httpStatus = require('http-status');
const { User } = require('../models/index.js');
const APIError = require('../utils/APIError.js');

const createUser = async (userBody) => {
  if (await User.isEmailAvailable(userBody.email)) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await User.create(userBody);
  return user.toJSON({ transform: true });
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = { createUser, getUserByEmail };
