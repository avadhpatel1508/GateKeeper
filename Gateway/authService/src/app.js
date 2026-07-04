const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const logger = require('./config/logger');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/appError');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use((req, res, next) => {
  console.log("Auth Service:", req.method, req.originalUrl);
  next();
});
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth service is healthy' });
});

app.use('/api/auth', authRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
