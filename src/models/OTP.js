

const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['login', 'signup'], default: 'login' },
  createdAt: { type: Date, default: Date.now, expires: 300 } // expire après 5 min
});

module.exports = mongoose.model('OTP', OTPSchema);
