const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projetSchema = new Schema({
    nom: String,
    description: String,
    dateDebut: Date,
    dateFin: Date,
    coutProjet: Number,
    dateRenouvellement: Date,
    dateHebergement: Date,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Référence au client
    file: String,
    status: {
        type: Number,
        default: 0 // etat active no archives 
    }
});

const Projet = mongoose.model('Projet', projetSchema);

module.exports = Projet;
