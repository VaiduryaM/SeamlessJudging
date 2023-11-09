require('dotenv/config');

module.exports = {
  secret: process.env.JWT_KEY,
  jwtExpiration: 60*30,          // 30 minute
  jwtRefreshExpiration: 60*60*24,  // 1day
};
