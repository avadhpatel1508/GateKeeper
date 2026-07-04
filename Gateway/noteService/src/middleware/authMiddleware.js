const AppError = require('../utils/appError');

const protect = async (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Authentication required'));
  }
  next();
};

module.exports = { protect };
