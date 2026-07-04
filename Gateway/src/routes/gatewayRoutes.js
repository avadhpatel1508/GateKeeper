const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { validateJwt } = require('../middleware/jwtMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const NOTES_SERVICE_URL = process.env.NOTES_SERVICE_URL || 'http://localhost:5002';

const proxyOptions = (target, rewriteFrom, rewriteTo) => ({
  target,
  changeOrigin: true,
  pathRewrite: {
    [rewriteFrom]: rewriteTo,
  },
  on: {
    proxyReq: fixRequestBody,
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-For', req.ip);
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Email', req.user.email);
      proxyReq.setHeader('X-User-Role', req.user.role);
    }
  },
  onError: (err, req, res) => {
    res.status(502).json({ success: false, error: 'Bad gateway' });
  },
});

router.post(
  '/auth/register',
  rateLimiter,
  createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL, '^/auth/register', '/api/auth/register'))
);
router.post(
  '/auth/login',
  rateLimiter,
  createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL, '^/auth/login', '/api/auth/login'))
);
router.get(
  '/auth/profile',
  validateJwt,
  rateLimiter,
  createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL, '^/auth/profile', '/api/auth/profile'))
);
router.get('/notes', validateJwt, rateLimiter, createProxyMiddleware(proxyOptions(NOTES_SERVICE_URL, '^/notes', '/api/notes')));
router.get('/notes/:id', validateJwt, rateLimiter, createProxyMiddleware(proxyOptions(NOTES_SERVICE_URL, '^/notes', '/api/notes')));
router.post('/notes', validateJwt, rateLimiter, createProxyMiddleware(proxyOptions(NOTES_SERVICE_URL, '^/notes', '/api/notes')));
router.patch('/notes/:id', validateJwt, rateLimiter, createProxyMiddleware(proxyOptions(NOTES_SERVICE_URL, '^/notes', '/api/notes')));
router.delete('/notes/:id', validateJwt, rateLimiter, createProxyMiddleware(proxyOptions(NOTES_SERVICE_URL, '^/notes', '/api/notes')));

module.exports = router;
