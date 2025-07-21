const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// ✅ POST /api/auth/signup — Create new user
router.post('/signup', authController.signup);

// ✅ POST /api/auth/login — Login user
router.post('/login', authController.login);

// 📌 Future: Add password reset, email verify, etc.
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

module.exports = router;
