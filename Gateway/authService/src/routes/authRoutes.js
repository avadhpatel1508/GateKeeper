const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { trustGatewayUser } = require('../middleware/gatewayAuthMiddleware');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', trustGatewayUser, getProfile);

module.exports = router;
