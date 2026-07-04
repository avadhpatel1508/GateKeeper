require("dotenv").config();

const util = require("util");

if (typeof util._extend === "undefined") {
  util._extend = Object.assign;
}

const app = require("./app");
const logger = require("./config/logger");
const redisClient = require("./config/redis");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await redisClient.connect();
    logger.info("✅ Redis connected successfully");

    app.listen(port, () => {
      logger.info(`🚀 Gateway running on port ${port}`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect Redis");
    logger.error(err);

    process.exit(1);
  }
}

startServer();