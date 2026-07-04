const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

module.exports = connectDB;
