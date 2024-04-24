// client.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    // Définissez les propriétés du client ici
    nom: String,
    numero: String,
    etat: String,
    notes: String,
    nomentreprise: String,
    pays: String,
    cin: String,
    adresse: String,
   
    projetsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projet' }],
    rendezVous: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RendezVous' }], // Référence aux rendez-vous associés à ce client
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
