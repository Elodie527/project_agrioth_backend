const cron = require('node-cron');
const Irrigation = require('../models/Irrigation');
const irrigationController = require('../controllers/IrrigationController');

// Cron toutes les minutes pour vérifier les irrigations pending
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const pendingIrrigations = await Irrigation.find({ status: 'pending', date: { $lte: now } });

    for (const irrigation of pendingIrrigations) {
      // Récupérer la dernière mesure
      const sensor = await irrigationController.getLastSensorReading(irrigation.box);

      if (!sensor) {
        console.log(`Aucune mesure pour box ${irrigation.box}`);
        continue;
      }

      // Calcul simple quantité d’eau selon humidité
      // Par exemple : si humidité < 50% -> 10 litres, sinon 5 litres
      let waterNeeded = sensor.humidity < 50 ? 10 : 5;

      console.log(`Irrigation pour box ${irrigation.box} : ${waterNeeded}L`);

      // TODO : envoyer la commande à la box via GSM (ESP32)
      // Exemple : await sendCommandToBox(irrigation.box, waterNeeded);

      // Marquer comme completed
      await irrigationController.completeIrrigation(irrigation._id, waterNeeded);
    }
  } catch (err) {
    console.error('Erreur scheduler irrigation:', err);
  }
});
