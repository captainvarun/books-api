const config = require('../config/index.js');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Books: Books Management API',
    version: '0.0.1',
    description: 'Manage books across your library seamlesslly',
    license: {
      name: 'MIT',
      url: 'https://github.com/captainvarun',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
      description: 'Development Server',
    },
    {
      url: `/api/v1`,
      description: 'Production Server',
    },
  ],
};

module.exports = swaggerDefinition;
