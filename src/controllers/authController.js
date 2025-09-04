const User = require('../models/User');
const DeviceSession = require('../models/DeviceSession');
const otpService = require('../services/otpService');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Formate les infos de l'utilisateur pour le front
const formatUser = (user) => ({
  id: user._id,
  phoneNumber: user.phoneNumber,
  firstname: user.firstname,
  lastname: user.lastname,
  fullName: `${user.firstname} ${user.lastname}`,
  region: user.region,
  status: user.status,
  createdAt: user.createdAt
});

// ===================== Vérification du téléphone =====================
exports.checkPhone = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      // Nouvel utilisateur → générer OTP
      const otp = await otpService.generateOTP(phone, 'signup');
      return res.json({
        success: true,
        message: "Utilisateur non trouvé, OTP envoyé",
        otp,
        isNewUser: true
      });
    }

    // Ancien utilisateur → ne pas générer OTP
    return res.json({
      success: true,
      message: "Utilisateur existant",
      isNewUser: false
    });

  } catch (error) {
    console.error('Erreur checkPhone:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ===================== Demande OTP =====================
exports.requestOtp = async (req, res) => {
  const { phone, purpose = 'login' } = req.body;

  if (!phone) return res.status(400).json({ success: false, message: 'Numéro requis' });

  try {
    const code = await otpService.generateOTP(phone, purpose);
    console.log(`OTP pour ${phone} (${purpose}) : ${code}`); // <-- ici
    return res.json({ success: true, message: 'OTP envoyé', otp: code });
  } catch (error) {
    console.error('Erreur requestOtp:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la génération OTP' });
  }
};

// ===================== Vérification OTP =====================
exports.verifyOtp = async (req, res) => {
  const { phone, code, deviceId, purpose = 'login' } = req.body;

  if (!phone || !code || !deviceId)
    return res.status(400).json({ success: false, message: 'Numéro, code et deviceId requis' });

  try {
    const validOtp = await otpService.verifyOTP(phone, code, purpose);
    if (!validOtp) return res.status(400).json({ success: false, message: 'OTP invalide ou expiré' });

    let user = await User.findOne({ phoneNumber: phone });

    // Si nouvel utilisateur pour signup, ne crée pas encore le user
    if (purpose === 'signup' && !user) {
      return res.json({ success: true, isNewUser: true, message: 'OTP valide, compléter l’inscription' });
    }

    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    // Login utilisateur existant
    const token = jwt.sign({ id: user._id, phone: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '90d' });

    await DeviceSession.findOneAndUpdate(
      { user: user._id, deviceId },
      { refreshToken: uuidv4() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, token, user: formatUser(user), isNewUser: false });
  } catch (error) {
    console.error('Erreur verifyOtp:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ===================== Inscription complète =====================
exports.signupComplete = async (req, res) => {
  const { phone, firstname, lastname, region, } = req.body;

  if (!phone || !firstname || !lastname || !region) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber: phone });
    if (existingUser) return res.status(400).json({ success: false, message: "Utilisateur déjà inscrit" });

    const user = new User({ phoneNumber: phone, firstname, lastname, region });
    await user.save();

    // Génération token
    const token = jwt.sign({ id: user._id, phone: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '90d' });

    res.json({ success: true, message: "Inscription terminée", token, user: formatUser(user) });
  } catch (error) {
    console.error("signupComplete error:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ===================== Récupérer profil =====================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ===================== Déconnexion =====================
exports.logout = async (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) return res.status(400).json({ success: false, message: 'deviceId requis' });

  try {
    await DeviceSession.deleteOne({ user: req.userId, deviceId });
    res.json({ success: true, message: 'Déconnecté avec succès' });
  } catch (error) {
    console.error('Erreur logout:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
