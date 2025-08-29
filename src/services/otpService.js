const OTP = require('../models/OTP');

module.exports = {
  generateOTP: async (phone, purpose) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await OTP.create({ phoneNumber: phone, code, purpose });
    return code;
  },

  verifyOTP: async (phone, code, purpose) => {
    const otp = await OTP.findOne({ phoneNumber: phone, code, purpose });
    return !!otp;
  }
};