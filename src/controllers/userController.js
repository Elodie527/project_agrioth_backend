const User = require('../models/User');
const DeviceSession = require('../models/DeviceSession');

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ['firstname', 'lastname', 'region'];

  const isValidUpdate = Object.keys(updates).every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).json({
      success: false,
      message: 'Mise à jour non autorisée'
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    if (updates.firstname !== undefined) user.firstname = updates.firstname;
    if (updates.lastname !== undefined) user.lastname = updates.lastname;
    if (updates.region !== undefined) user.region = updates.region;

    await user.save();

    res.json({
      success: true,
      message: 'Profil mis à jour',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstname: user.firstname,
        lastname: user.lastname,
        region: user.region,
        status: user.status
      }
    });
  } catch (error) {
    console.error(' Erreur updateProfile:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    await DeviceSession.deleteMany({ user: req.userId });

    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteAccount:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
