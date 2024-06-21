// client.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({

    nom: String,
    prenom: String,

    numero: String,
    etat: String,
    notes: String,
    nomentreprise: String,
    pays: String,
    prenom: String,
    Matriculefiscale: String,
    adresse: String,
    archive: {
        type: Boolean,
        default: false
    }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
