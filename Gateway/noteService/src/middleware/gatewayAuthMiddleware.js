const AppError = require('../utils/appError');

const trustGatewayUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];

  if (!userId || !userEmail) {
    return next(new AppError(401, 'Missing gateway authentication headers'));
  }

  req.user = {
    id: userId,
    email: userEmail,
    role: userRole || 'user',
  };
  next();
};

module.exports = { trustGatewayUser };
