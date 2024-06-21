const mongoose = require('mongoose');

const RisqueSchema = new mongoose.Schema({
    nom: String,
    description: String,
    probabilite: String,
    impact: String,
    niveau: String,
    projet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet',
    },
}, { timestamps: true });

module.exports = mongoose.model('Risque', RisqueSchema);
