const mongoose = require('mongoose');
const Budget = require('../models/Budget'); // Importez correctement le modèle Budget
const createBudgetForProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        if (!projectId) {
            return res.status(400).json({ message: 'ID de projet non spécifié' });
        }

        const { depense, prix } = req.body; // Assurez-vous que ces valeurs sont fournies dans la requête

        const newBudget = new Budget({
            projetId: projectId, // Utilisez projectId au lieu de projetId
            depense,
            prix,
        });

        await newBudget.save();

        res.status(200).json({ message: 'Budget créé avec succès pour le projet' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la création du budget' });
    }
};

module.exports = {
    createBudgetForProject,
};