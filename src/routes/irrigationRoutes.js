// src/routes/irrigationRoutes.js
const express = require('express');
const router = express.Router();

// ⚠️ Respecter la casse réelle du fichier sur le disque
// (Sous Windows ça “passe”, mais autant éviter toute ambiguïté)
const irrigationController = require('../controllers/IrrigationController');

// Le middleware d’auth peut être exporté soit par défaut, soit nommé.
// On gère les deux cas pour éviter "argument handler must be a function".
const maybeAuth = require('../middleware/authenticate');
const authMiddleware =
  typeof maybeAuth === 'function' ? maybeAuth : maybeAuth?.authenticate;

if (typeof irrigationController?.addIrrigation !== 'function') {
  throw new Error(
    'irrigationController.addIrrigation est introuvable ou non-fonction. Vérifie les exports.'
  );
}

if (typeof irrigationController?.getUserIrrigations !== 'function') {
  throw new Error(
    'irrigationController.getUserIrrigations est introuvable ou non-fonction. Vérifie les exports.'
  );
}

if (typeof authMiddleware !== 'function') {
  throw new Error(
    "Le middleware d'auth n'est pas une fonction. Assure-toi d'exporter soit `module.exports = (req,res,next)=>{...}` soit `module.exports = { authenticate: (req,res,next)=>{} }`."
  );
}

// Programmer une irrigation
router.post('/add', authMiddleware, irrigationController.addIrrigation);

// Liste des irrigations de l’utilisateur
router.get('/', authMiddleware, irrigationController.getUserIrrigations);

module.exports = router;
