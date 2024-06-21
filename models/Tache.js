// tache.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid'); // Import de uuidv4 depuis la bibliothèque uuid

const tacheSchema = new Schema({
  id: { type: String, default: uuidv4 }, // Correction de l'import de uuidv4
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
    required: true,
  },
  developpeur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  etat: {
    type: String,
    required: true,
  },
  chefProjet: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Référence au client

  description: {
    type: String,
    maxlength: 200, // Définissez ici la longueur maximale de la description
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
    get: (val) => val ? val.toISOString().split('T')[0] : ''
  },
  dateFin: {
    type: Date,
    required: true,
    get: (val) => val ? val.toISOString().split('T')[0] : ''
  },
});

const Tache = mongoose.model('Tache', tacheSchema);

module.exports = Tache;
