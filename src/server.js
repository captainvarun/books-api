const config = require('./config');
const app = require('./app.js');
const { connectDB } = require('./utils/mongo.js');
const logger = require('./utils/logger.js');

let server;

async function startServer() {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error(error);
  }
}

startServer();
