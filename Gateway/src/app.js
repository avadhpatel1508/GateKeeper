const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const logger = require('./config/logger');
const gatewayRoutes = require('./routes/gatewayRoutes');
const AppError = require('./utils/appError');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

app.get('/health', async (req, res) => {
  res.status(200).json({ success: true, message: 'Gateway is healthy' });
});

app.get('/docs', async (req, res) => {
  res.status(200).json({ success: true, message: 'Gateway API documentation endpoint' });
});

app.use('/api', gatewayRoutes);

app.use((req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;