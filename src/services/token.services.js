const config = require('../config');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/APIError.js');

const generateToken = (userId, expires, type) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: dayjs(expires).unix(),
    type,
  };

  return jwt.sign(payload, config.jwt.secret);
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);

  if (typeof payload.sub !== 'string') {
    throw new APIError(httpStatus.BAD_REQUEST, 'bad user');
  }

  return payload;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');
  const refreshTokenExpires = dayjs(Date.now()).add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = { verifyToken, generateAuthTokens, generateToken };
