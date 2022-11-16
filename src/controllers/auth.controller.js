const { bookService, userService, tokenService, authService } = require('../services/index.js');
const httpStatus = require('http-status');
const catchErrors = require('../utils/catchErrors.js');

const register = catchErrors(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateToken(user);
  res.status(201).send({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    },
    token,
  });
});

const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.login(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    },
    tokens,
  });
});

module.exports = {
  login,
  register,
};
