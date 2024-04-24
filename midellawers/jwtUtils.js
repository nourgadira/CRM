// Importez la bibliothèque dotenv pour charger les variables d'environnement depuis un fichier .env
require('dotenv').config();

// Utilisez process.env pour accéder à la clé secrète depuis les variables d'environnement
const secretKey = process.env.JWT_SECRET;

// Importez la bibliothèque jsonwebtoken pour la génération et la validation des jetons JWT
const jwt = require('jsonwebtoken');

// Fonction pour générer un jeton JWT
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Fonction pour valider un jeton JWT
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Erreur de validation du jeton:', error.message);
    return null;
  }
}

// Exportez les fonctions pour les rendre disponibles dans d'autres fichiers
module.exports = {
  generateToken,
  validateToken,
};
