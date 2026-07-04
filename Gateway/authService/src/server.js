const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const port = process.env.PORT || 5001;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Auth service running on port ${port}`);
    });
  } catch (error) {
    logger.error('Unable to start auth service', error);
    process.exit(1);
  }
})();
