const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cin: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    salairefixe: { type: String, required: true },
    prime: { type: String, required: true },
    image: { type: String, default: true },
    active: { type: String },
    rating: { type: Number, default: 0 } // Ajouter le champ "rating" de type Number avec une valeur par défaut de 0

});
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
