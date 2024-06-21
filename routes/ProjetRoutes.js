const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');
const multer = require('multer');
const passport = require('passport');
const Projet = require('../models/Projet');

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
router.get('/payment-status', projetController.getProjetsByPaymentStatus);
router.get('/projets/:paye', async (req, res) => {
    const { paye } = req.params;

    try {
        const projets = await Projet.find({ paye });
        res.status(200).json({ projets });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Route POST pour créer un nouveau projet avec un fichier joint
router.post('/projets', passport.authenticate("jwt", { session: false }), projetController.createProjet);
router.get('/projet/:id/check-finished', projetController.checkProjetFinished);



// Route GET pour récupérer tous les projets
router.get('/projets', passport.authenticate("jwt", { session: false }), projetController.getProjets);

// Route GET pour récupérer tous les projets de le client courant
router.get('/projects/:clientId', projetController.getProjectsByClientId);
router.get('/projetsArchive', projetController.getProjetsArchive);

// Route GET pour récupérer un projet par ID
router.get('/projet/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    projetController.getProjetById(req, res);
});

// Route PUT pour mettre à jour un projet par ID
router.put('/projet/:id', passport.authenticate("jwt", { session: false }), projetController.updateProjet);

// Route DELETE pour supprimer un projet par ID
router.delete('/projet/:id/:status', passport.authenticate("jwt", { session: false }), projetController.deleteProjet);

module.exports = router;
