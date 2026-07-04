const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const logger = require('./config/logger');
const noteRoutes = require('./routes/noteRoutes');
const AppError = require('./utils/appError');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

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
  res.status(200).json({ success: true, message: 'Note service is healthy' });
});

app.use('/api/notes', noteRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
