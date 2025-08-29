const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // Corrige le chemin

// Routes d'authentification
router.post('/check-phone', authController.checkPhone);
router.post('/request-otp', authController.requestOtp);
router.post('/signup-complete', authController.signupComplete);

router.post('/verify-otp', authController.verifyOtp);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.post('/logout', authMiddleware.authenticate, authController.logout);

module.exports = router;