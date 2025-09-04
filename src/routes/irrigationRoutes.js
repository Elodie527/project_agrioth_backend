const express = require('express');
const router = express.Router();
const irrigationController = require('../controllers/IrrigationController');
const authMiddleware = require('../middleware/authenticate');

// Programmer une irrigation
router.post('/add', authMiddleware, irrigationController.addIrrigation);

// Liste des irrigations de l’utilisateur
router.get('/', authMiddleware, irrigationController.getUserIrrigations);

module.exports = router;
