const express = require('express');
const router = express.Router();
const PaiememntController = require('../controllers/PaiememntController'); // Correction ici
const AvanceController = require('../controllers/AvanceController');
const ProjetController = require('../controllers/ProjetController');
const Projet = require('../models/Projet'); // Assurez-vous que le chemin d'accès est correct
const Paiement = require('../models/Paiement'); // Assurez-vous que le chemin d'accès est correct
const Avance = require('../models/Avance'); // Assurez-vous que le chemin d'accès est correct

const passport = require('passport');
const mongoose = require('mongoose');

// Routes pour les paiements

router.post('/paiement', PaiememntController.AddPaiement);
router.get('/paiement', passport.authenticate("jwt", { session: false }), PaiememntController.FindAll);
router.get('/paiement/:id', passport.authenticate("jwt", { session: false }), PaiememntController.FindOne);
router.patch('/paiement/:id', passport.authenticate("jwt", { session: false }), PaiememntController.UpdateOne);
router.delete('/paiement/:id', passport.authenticate("jwt", { session: false }), PaiememntController.DeleteOne);
router.get('/project/:id', PaiememntController.getPaiementsByProjectId);
router.get('/projet/:id/resteAPayer', PaiememntController.calculerResteAPayer);

module.exports = router;
