const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const validateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Not authorized, token missing')); 
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email || decoded.email,
      role: decoded.role || 'user',
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expired'));
    }
    next(new AppError(401, 'Authentication failed'));
  }
};

module.exports = { validateJwt };
