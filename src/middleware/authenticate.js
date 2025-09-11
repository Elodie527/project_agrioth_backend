const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    console.log('[authMiddleware] Requête reçue avec headers:', req.headers);
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[authMiddleware] Erreur: Authentification requise');
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const token = authHeader.split(' ')[1];
      console.log('[authMiddleware] Token extrait:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Token décodé :', decoded);

      req.userId = decoded.id;
      console.log('[authMiddleware] Authentification réussie, userId:', req.userId);
      next();
    } catch (error) {
      console.error('Erreur authentification :', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }
};