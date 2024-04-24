// validation.js

const User = require('../models/User'); // Importez le modèle User

module.exports.isValidDeveloperId = async function(id) {
    try {
        const user = await User.findById(id);
        return user !== null; // Retourne vrai si l'utilisateur avec cet ID existe
    } catch (error) {
        console.error('Erreur lors de la validation de l\'ID du développeur:', error);
        return false; // En cas d'erreur, considérez l'ID comme invalide
    }
};
