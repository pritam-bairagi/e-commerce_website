const express = require('express');
const router = express.Router();
const {
    register,
    verifyOTP,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    checkAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);
router.get('/check-auth', protect, checkAuth);
router.get('/me', protect, getMe);

module.exports = router;
