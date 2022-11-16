require('dotenv').config();

const envVars = process.env;

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.NODE_ENV === 'production' ? envVars.MONGODB_URL : envVars.MONGODB_DEV_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES ?? 30,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS ?? 30,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
    },
  },
  roles: ['user', 'admin'],
};

module.exports = config;
