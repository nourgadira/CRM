const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');
const Projet = require('../models/Projet'); // Assurez-vous d'importer correctement le modèle Projet
const multer = require('multer');
// Configuration de multer pour gérer les fichiers joints
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Le dossier où enregistrer les fichiers joints
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Utilisez le nom original du fichier
    }
});
const upload = multer({ storage: storage });

router.post('/uploads', projetController.upload);

// Route POST pour créer un nouveau projet avec un fichier joint
router.post('/projet',  projetController.createProjet);

// Route POST pour créer un nouveau projet sans fichier joint
router.post('/projets', async (req, res) => {
    try {
        const {
            nom,
            description,
            dateDebut,
            dateFin,
            coutProjet,
            dateRenouvellement,
            dateHebergement,
            coutMaintenance, // Assurez-vous que ce champ est inclus dans req.body
            clientId,
            tachesIds
        } = req.body;
        // Créer un nouveau projet avec les données fournies
        const nouveauProjet = new Projet({
            nom,
            description,
            dateDebut,
            dateFin,
            coutProjet,
            dateRenouvellement,
            dateHebergement,
            coutMaintenance, // Inclure le champ coutMaintenance
            clientId,
            taches: tachesIds,
        });

        // Enregistrer le nouveau projet dans la base de données
        const projetCree = await nouveauProjet.save();

        res.status(201).json({ message: 'Projet créé avec succès', projet: projetCree });
    } catch (error) {
        console.error('Erreur lors de la création du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
    }
});

// Route GET pour récupérer tous les projets
router.get('/projets', projetController.getProjets);

// Route GET pour récupérer tous les projets de le client courant
router.get('/projetsClient/:clientId', projetController.getProjetsByIdClient);

router.get('/projetsArchive', projetController.getProjetsArchive);

// Route GET pour récupérer un projet par ID
router.get('/projet/:id', (req, res) => {
    projetController.getProjetById(req, res);
});

// Route PUT pour mettre à jour un projet par ID
router.put('/projet/:id', projetController.updateProjet);

// Route DELETE pour supprimer un projet par ID
router.delete('/projet/:id/:status', projetController.deleteProjet);

module.exports = router;
