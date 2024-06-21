const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController'); // Importez correctement le contrôleur BudgetController
const mongoose = require('mongoose');
const Budget = require('../models/Budget'); // Assurez-vous que le chemin est correct

router.post('/projets/:projectId/budgets', BudgetController.createBudgetForProject);
router.get('/projets/:projectId/budgets', async (req, res) => {
    const projectId = req.params.projectId;

    try {
        // Requête pour récupérer les budgets du projet avec l'ID projectId
        const budgets = await Budget.find({ projetId: projectId });

        res.status(200).json(budgets);
    } catch (error) {
        console.error('Erreur lors de la récupération des budgets :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des budgets' });
    }
});
module.exports = router;
