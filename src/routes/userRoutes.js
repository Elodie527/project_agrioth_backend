const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Routes utilisateur protégées
router.put('/profile', authenticate, userController.updateProfile);
router.delete('/profile', authenticate, userController.deleteAccount);

module.exports = router;
