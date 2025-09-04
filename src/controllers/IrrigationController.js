const Irrigation = require('../models/Irrigation');
const SensorReading = require('../models/SensorReading');
const Box = require('../models/Box');

// Ajouter une irrigation
const addIrrigation = async (req, res) => {
  try {
    const { boxId, date, mode } = req.body;
    if (!boxId || !date) return res.status(400).json({ success: false, message: 'boxId et date requis' });

    const irrigation = new Irrigation({
      user: req.userId,
      box: boxId,
      date,
      mode: mode || 'auto',
    });

    await irrigation.save();
    res.json({ success: true, irrigation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer les irrigations de l’utilisateur
const getUserIrrigations = async (req, res) => {
  try {
    const irrigations = await Irrigation.find({ user: req.userId }).populate('box');
    res.json({ success: true, irrigations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Marquer irrigation comme terminée
const completeIrrigation = async (irrigationId, waterUsed) => {
  try {
    const irrigation = await Irrigation.findById(irrigationId);
    if (!irrigation) return null;

    irrigation.status = 'completed';
    irrigation.waterUsed = waterUsed;
    irrigation.endTime = new Date();
    await irrigation.save();
    return irrigation;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Récupérer la dernière mesure d’une box
const getLastSensorReading = async (boxId) => {
  return await SensorReading.findOne({ box: boxId }).sort({ timestamp: -1 });
};

module.exports = {
  addIrrigation,
  getUserIrrigations,
  completeIrrigation,
  getLastSensorReading
};