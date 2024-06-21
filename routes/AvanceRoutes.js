const express = require('express');
const router = express.Router();
const AvanceController = require('../controllers/AvanceController');
const PaiememntController = require('../controllers/PaiememntController');
const ProjetController = require('../controllers/ProjetController');

const passport = require('passport');
const mongoose = require('mongoose');

// Import the Avance model
const Avance = require('../models/Avance'); // Make sure to replace this path with the correct path to your Avance model file

router.get('/avances/:projetId', async (req, res) => {
    try {
        const projetId = req.params.projetId;
        if (!mongoose.Types.ObjectId.isValid(projetId)) {
            return res.status(400).json({ error: 'Invalid project ID format' });
        }

        const avances = await Avance.find({ projetId });

        if (!avances.length) {
            return res.status(404).json({ message: 'Aucune avance trouvée pour ce projet' });
        }

        res.status(200).json(avances);
    } catch (error) {
        console.error('Erreur lors de la récupération des avances pour le projet:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});

// Routes pour les paiements
router.post('/avance', AvanceController.AddAvance);
router.get('/avance', AvanceController.FindAll);
router.get('/avance/:id', AvanceController.FindOne);
router.patch('/avance/:id', passport.authenticate("jwt", { session: false }), AvanceController.UpdateOne);
router.delete('/avance/:id', passport.authenticate("jwt", { session: false }), AvanceController.DeleteOne);

module.exports = router;
