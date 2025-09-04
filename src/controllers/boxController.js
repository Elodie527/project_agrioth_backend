const Box = require('../models/Box');

exports.addBox = async (req, res) => {
  try {
    const { boxNumber } = req.body;
    if (!boxNumber) return res.status(400).json({ success: false, message: "boxNumber requis" });

    // Crée la nouvelle box
    const newBox = new Box({ boxNumber, user: req.userId });
    await newBox.save();

    // Récupère toutes les boxes de cet utilisateur
    const userBoxes = await Box.find({ user: req.userId });

    res.json({
      success: true,
      message: "Box ajoutée avec succès",
      box: { id: newBox._id, boxNumber: newBox.boxNumber },
      boxes: userBoxes.map(b => ({ id: b._id, boxNumber: b.boxNumber })),
      boxesCount: userBoxes.length
    });
  } catch (error) {
    console.error('Erreur addBox:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


// Lister les boxes de l'utilisateur
exports.getBoxes = async (req, res) => {
  try {
    const boxes = await Box.find({ user: req.userId });
    res.json({ success: true, boxes });
  } catch (error) {
    console.error('Erreur getBoxes:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
