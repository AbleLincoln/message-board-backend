const moment = require('moment');

// logger middleware
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} on ${moment().format()}`);
  next();
};

module.exports = logger;
