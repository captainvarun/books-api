const { bookService, userService, tokenService, authService } = require('../services/index.js');
const httpStatus = require('http-status');
const catchErrors = require('../utils/catchErrors.js');

const register = catchErrors(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).send({
    name: user.name,
    email: user.email,
    role: user.role,
    id: user.id,
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
