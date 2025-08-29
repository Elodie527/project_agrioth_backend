const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Token décodé :', decoded);

      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error(' Erreur authentification :', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }
};
