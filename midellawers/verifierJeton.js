const jwt = require('jsonwebtoken');

const verifierJeton = (req, res, next) => {
  const jeton = req.headers.authorization;
  if (!jeton) {
    console.log('Jeton manquant dans les en-têtes de la requête');
    return res.status(401).json({ message: 'Le jeton d\'autorisation est manquant' });
  }

  try {
    const decoded = jwt.verify(jeton, 'votre_clé_secrète');
    req.userData = decoded; // Attacher les données utilisateur à l'objet de requête
    console.log('Jeton valide pour l\'utilisateur:', decoded.userId);
    next();
  } catch (erreur) {
    console.error('Erreur de validation du jeton:', erreur.message);
    return res.status(401).json({ message: 'Jeton invalide' });
  }
};

module.exports = verifierJeton;
