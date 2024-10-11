const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/register.controller');

router.post('/register', RegisterController.register);
router.post('/login', RegisterController.login);
router.post('/refreshToken', RegisterController.refreshToken);

module.exports = router;