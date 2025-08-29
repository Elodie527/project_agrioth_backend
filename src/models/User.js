const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: v => /^\+?[1-9]\d{1,14}$/.test(v),
      message: 'Numéro de téléphone invalide'
    }
  },
  firstname: { 
    type: String,
    required: true,
    trim: true
  },
  lastname: { 
    type: String,
    required: true,
    trim: true
  },
  region: { 
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending_box', 'active', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  }
});

UserSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model('User', UserSchema);