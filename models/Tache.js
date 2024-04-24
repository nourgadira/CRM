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
  etat: {
    type: String,
    required: true,
    default: 'NOT_ASSIGNED', // 0
    enum: ['NOT_ASSIGNED', 'TODO', 'INPROGRESS', 'DONE']
  },
  description: {
    type: String,
    maxlength: 200, // Définissez ici la longueur maximale de la description
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  idDeveloppeur: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  etatDeveloppeur: {
    type: String,
    required: true,
    default: 'Non Validé', // 0
    enum: ['Non Validé', 'Validé']
  },
});

const Tache = mongoose.model('Tache', tacheSchema);

module.exports = Tache;
