const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  humidity: { type: Number, required: true }, // %
  temperature: { type: Number, required: true }, // °C
  rain: { type: Boolean, default: false },
  waterLevel: { type: Number, required: true }, // litres
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SensorReading', SensorReadingSchema);
