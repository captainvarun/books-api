const express = require('express');
const authRoute = require('./auth.route.js');
const bookRoute = require('./book.route.js');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/books',
    route: bookRoute,
  },
];

defaultRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
