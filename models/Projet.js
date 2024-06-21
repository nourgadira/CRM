const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projetSchema = new Schema({
    nom: String,
    description: String,
    dateDebut: {
        type: Date,
        get: (val) => val ? val.toISOString().split('T')[0] : ''
    },

    dateFin: {
        type: Date,
        get: (val) => val ? val.toISOString().split('T')[0] : ''
    },

    coutProjet: Number,
    dateHebergement: Date,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Référence au client
    chefProjet: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence au client
    file: String,
    etat: {
        type: String,
        enum: ['en cours', 'fini'],
        default: 'en cours' // Par défaut, un projet est considéré comme "en cours"
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tache' },// Define the taskId field if needed

    status: {
        type: Number,
        default: 0 // etat active no archives 
    },
    isPaid: { type: Boolean, default: false },
    payment: Number,
});

const Projet = mongoose.model('Projet', projetSchema);

module.exports = Projet;
