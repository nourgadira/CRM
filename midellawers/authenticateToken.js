// authenticateToken.js

const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Retourne les données décryptées du token
  } catch (error) {
    return null; // Retourne null si le token est invalide ou expiré
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Non autorisé
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).json({ message: 'Token invalide' });
  }

  req.user = decodedToken;
  next();
}

module.exports = { authenticateToken };
