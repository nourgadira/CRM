const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({

    dateHeure: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    langue: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    nomclient: {
        type: String,
        required: true
    },
    prenomclient: {
        type: String,
        required: true
    },

    lieu: {
        type: String
    },
    status: {
        type: String,
    }


});

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;
