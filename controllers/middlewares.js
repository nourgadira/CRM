// middlewares.js

// Middleware pour vérifier le rôle de l'utilisateur
function checkUserRole(role) {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        next(); // Continuer si le rôle correspond
      } else {
        res.status(403).json({ message: "Accès non autorisé." });
      }
    };
  }
  
  // Middleware pour vérifier si l'utilisateur est connecté
  function checkLoggedIn(req, res, next) {
    if (req.user) {
      next(); // Continuer si l'utilisateur est connecté
    } else {
      res.status(401).json({ message: "Non connecté." });
    }
  }
  
  module.exports = { checkUserRole, checkLoggedIn };
  