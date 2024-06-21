const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaiementSchema = new Schema({

    status: {
        type: String,
        enum: ['Payé', 'Impayé'], default: 'Impayé'
    },
    montant: {
        type: Number
    },

    resteAPayer: {
        type: Number

    },
    projet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet',
    },

    notes: {
        type: String
    }
});

const Paiement = mongoose.model('Paiement', PaiementSchema);

module.exports = Paiement;
