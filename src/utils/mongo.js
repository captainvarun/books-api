const config = require('../config');
const mongoose = require('mongoose');

const connectDB = async (url) => await mongoose.connect(url ?? config.mongoose.url, config.mongoose.options);

const disconnectDB = async () => await mongoose.disconnect();

module.exports = { connectDB, disconnectDB };
