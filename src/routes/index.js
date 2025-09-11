const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const authMiddleware = require('../middleware/authenticate');
const sensorRoutes = require('./sensorRoutes');


// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateur (protégées)
router.use('/user', authMiddleware.authenticate, userRoutes);
router.use('/', sensorRoutes); // ou router.use('/api', sensorRoutes);
module.exports = router;
