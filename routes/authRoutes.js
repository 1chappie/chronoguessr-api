const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const {loginLimiter} = require("../middleware/loginLimiter");

router.post('/login', loginLimiter, authController.login);
router.post('/token', authController.refreshToken);
router.delete('/logout', authController.logout);
router.post('/register', loginLimiter, authController.register);

module.exports = router;
