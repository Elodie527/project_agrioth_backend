// src/controllers/irrigationController.js
const Irrigation = require('../models/Irrigation');
const SensorReading = require('../models/SensorReading');
const Box = require('../models/Box');

/**
 * POST /api/irrigations/add
 * Programmer / ajouter une irrigation
 */
const addIrrigation = async (req, res) => {
  try {
    // On s'assure que le middleware d'auth a bien ajouté req.userId
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const { boxId, date, mode } = req.body;
    if (!boxId || !date) {
      return res
        .status(400)
        .json({ success: false, message: 'boxId et date sont requis' });
    }

    // Vérifier l’existence de la box (optionnel mais plus propre)
    const box = await Box.findById(boxId);
    if (!box) {
      return res.status(404).json({ success: false, message: 'Box introuvable' });
    }

    // Normaliser la date
    const scheduledAt = new Date(date);
    if (isNaN(scheduledAt.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: 'date invalide (format ISO recommandé)' });
    }

    const irrigation = new Irrigation({
      user: req.userId,
      box: boxId,
      date: scheduledAt,
      mode: mode || 'auto',
      //avant cetait scheduled
      status: 'pending', // valeur par défaut utile si absente dans le schéma
    });

    await irrigation.save();
    return res.json({ success: true, irrigation });
  } catch (err) {
    console.error('[addIrrigation] erreur:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

/**
 * GET /api/irrigations
 * Récupérer les irrigations de l’utilisateur
 */
const getUserIrrigations = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const irrigations = await Irrigation.find({
      user: req.userId,
      date: { $gte: oneMonthAgo }, // Irrigations datant au plus d’un mois
    })
      .populate('box')
      .sort({ date: -1 });

    return res.json({ success: true, irrigations });
  } catch (err) {
    console.error('[getUserIrrigations] erreur:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


/**
 * Marquer une irrigation comme terminée (utilitaire interne / scheduler)
 */
const completeIrrigation = async (irrigationId, waterUsed) => {
  try {
    const irrigation = await Irrigation.findById(irrigationId);
    if (!irrigation) return null;

    irrigation.status = 'completed';
    if (typeof waterUsed === 'number') irrigation.waterUsed = waterUsed;
    irrigation.endTime = new Date();
    await irrigation.save();
    return irrigation;
  } catch (err) {
    console.error('[completeIrrigation] erreur:', err);
    return null;
  }
};

/**
 * Récupérer la dernière mesure d’une box (utilitaire)
 */
const getLastSensorReading = async (boxId) => {
  return await SensorReading.findOne({ box: boxId }).sort({ timestamp: -1 });
};

module.exports = {
  addIrrigation,
  getUserIrrigations,
  completeIrrigation,
  getLastSensorReading,
};
