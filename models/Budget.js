const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, // Définissez le type ObjectId pour l'ID
        auto: true, // Activez la génération automatique de l'ID ObjectId
    },
    depense: {
        type: String,
    },
    prix: {
        type: Number, // Utilisez Number au lieu de number
    },
    projetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet',
    },
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
