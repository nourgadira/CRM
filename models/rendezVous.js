const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Référence au client

    dateHeure: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    confirmation: {
        type: Boolean,
        default: false
    },
    lieu: {
        type: String
    },
    langue: {
        type: String
    },
    annule: {
        type: Boolean,
        default: false
    }
});

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;
