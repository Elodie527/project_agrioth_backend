const express = require('express');
const router = express.Router();

// ⚠️ Respecter la casse réelle du fichier sur le disque
const irrigationController = require('../controllers/IrrigationController');
console.log('[irrigationRoutes] IrrigationController chargé:', irrigationController);

// Le middleware d’auth peut être exporté soit par défaut, soit nommé.
const maybeAuth = require('../middleware/authenticate');
console.log('[irrigationRoutes] Auth middleware chargé:', maybeAuth);
const authMiddleware = maybeAuth.authenticate; // Assigne directement la fonction

if (typeof irrigationController?.addIrrigation !== 'function') {
  throw new Error('irrigationController.addIrrigation est introuvable ou non-fonction. Vérifie les exports.');
}

if (typeof irrigationController?.getUserIrrigations !== 'function') {
  throw new Error('irrigationController.getUserIrrigations est introuvable ou non-fonction. Vérifie les exports.');
}

if (typeof authMiddleware !== 'function') {
  throw new Error("Le middleware d'auth n'est pas une fonction. Assure-toi d'exporter une fonction valide.");
}

// Programmer une irrigation
router.post('/add', (req, res, next) => {
  console.log('[irrigationRoutes] Requête POST /add reçue avec headers:', req.headers);
  authMiddleware(req, res, next);
}, irrigationController.addIrrigation);

// Liste des irrigations de l’utilisateur
router.get('/', (req, res, next) => {
  console.log('[irrigationRoutes] Requête GET / reçue avec headers:', req.headers);
  authMiddleware(req, res, next);
}, irrigationController.getUserIrrigations);

module.exports = router;