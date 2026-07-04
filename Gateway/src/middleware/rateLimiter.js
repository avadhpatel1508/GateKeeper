const client = require('../config/redis');
const logger = require('../config/logger');

const WINDOW_SECONDS = 3600;
const REQUEST_LIMIT = 100;

const rateLimiter = async (req, res, next) => {
  const userId = req.user?.id;
  const key = userId ? `rate:user:${userId}` : `rate:anon:${req.ip}`;
  const route = req.originalUrl;
  const method = req.method;

  try {
    let count;
    let ttl;
    console.log(client.isOpen);
    console.log(client.isReady);
    const setResult = await client.set(key, '1', { EX: WINDOW_SECONDS, NX: true });

    if (setResult === 'OK') {
      count = 1;
      ttl = WINDOW_SECONDS;
    } else {
      count = await client.incr(key);
      ttl = await client.ttl(key);
      if (ttl === -1) {
        await client.expire(key, WINDOW_SECONDS);
        ttl = WINDOW_SECONDS;
      }
    }

    const remaining = Math.max(0, REQUEST_LIMIT - count);
    const allowed = count <= REQUEST_LIMIT;
    const timestamp = new Date().toISOString();

    logger.info(`Rate limiter user=${userId || 'anonymous'} route=${route} method=${method} count=${count} remaining=${remaining} allowed=${allowed} timestamp=${timestamp}`);

    res.set('X-RateLimit-Limit', REQUEST_LIMIT.toString());
    res.set('X-RateLimit-Remaining', remaining.toString());
    res.set('Retry-After', ttl.toString());

    if (!allowed) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Try again later.',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      success: false,
      message: 'Rate limiting service unavailable.',
    });
  }
};

module.exports = { rateLimiter };