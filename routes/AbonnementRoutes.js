const express = require('express');
const router = express.Router();
const AbonnementController = require('../controllers/AbonnementController');
const passport = require('passport');
router.post('/abonnement', AbonnementController.createAbonnement);
router.get('/abonnement', AbonnementController.findAllAbonnements);
router.get('/abonnement/:id', passport.authenticate("jwt", { session: false }), AbonnementController.findAbonnementById);
router.patch('/abonnement/:id', passport.authenticate("jwt", { session: false }), AbonnementController.updateAbonnement);
router.delete('/abonnement/:id', passport.authenticate("jwt", { session: false }), AbonnementController.deleteAbonnement);

module.exports = router;
