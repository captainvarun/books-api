require('dotenv').config();

const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const xss = require('xss-clean');
const helmet = require('helmet');
const passport = require('passport');

const jwtStrategy = require('./utils/auth/passport.js');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error.js');
const rateLimiter = require('./middlewares/rateLimiter.js');
const docsRoute = require('./routes/swagger.route.js');
const morgan = require('./middlewares/morgan.js');

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(helmet());

app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({}));
app.use(xss());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/api/v1', routes);
app.use('/docs', docsRoute);

app.use((_req, _res, next) => next(new ApiError(httpStatus.NOT_FOUND, 'Not found')));

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
