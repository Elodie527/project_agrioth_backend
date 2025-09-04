const mongoose = require('mongoose');

const IrrigationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  date: { type: Date, required: true }, // date et heure programmées
  mode: { type: String, enum: ['auto', 'manuel'], default: 'auto' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  waterUsed: { type: Number, default: 0 }, // litres
  startTime: { type: Date },
  endTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Irrigation', IrrigationSchema);
