const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const port = process.env.PORT || 5002;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Note service running on port ${port}`);
    });
  } catch (error) {
    logger.error('Unable to start note service', error);
    process.exit(1);
  }
})();
