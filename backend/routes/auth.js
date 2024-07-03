const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const { authenticateToken } = require('../utilities');

router.post('/login', authController.postLogin);

router.post('/create-account', authController.postCreateAccount);

router.get('/get-user', authenticateToken, authController.getUser);

module.exports = router;