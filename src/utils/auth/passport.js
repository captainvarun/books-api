const config = require('../../config/index.js');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../../models/index.js');

const jwtStrategy = new Strategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload, done) => {
    try {
      if (payload.type !== 'access') throw new Error('Invalid token type');

      const user = await User.findById(payload.sub, {
        password: 0,
      });

      if (!user) return done(null, false);

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

module.exports = jwtStrategy;
