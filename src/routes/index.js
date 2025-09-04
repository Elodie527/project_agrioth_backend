const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const authMiddleware = require('../middleware/authenticate');

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateur (protégées)
router.use('/user', authMiddleware.authenticate, userRoutes);

module.exports = router;
