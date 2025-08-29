const mongoose = require('mongoose');

const DeviceSessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  deviceId: { 
    type: String, 
    required: true,
    index: true
  },
  refreshToken: { 
    type: String, 
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  expires: '90d'
});

module.exports = mongoose.model('DeviceSession', DeviceSessionSchema);