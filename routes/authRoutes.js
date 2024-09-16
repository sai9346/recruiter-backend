const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendOtp, verifyOtp } = require('../controllers/authController');

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// GET /auth/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

// POST /auth/resend-otp
router.post('/resend-otp', resendOtp);

// POST /auth/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
