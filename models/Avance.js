const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvanceSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Définissez le type ObjectId pour l'ID
        auto: true, // Activez la génération automatique de l'ID ObjectId
    },
    avance: {
        type: Number,
    },
    dateavance: {
        type: Date,
    },
    typeavance: {
        type: String
    },
    projetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet',
    },

});

const Avance = mongoose.model('Avance', AvanceSchema);

module.exports = Avance;
