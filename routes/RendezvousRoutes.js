const express = require('express');
const router = express.Router();
const RendezvousController = require('../controllers/RendezvousController');
const passport = require('passport');
// Routes pour les utilisateurs

router.post('/rendezvous', RendezvousController.AddRendezvous);
router.get('/rendezvous', passport.authenticate("jwt", { session: false }), RendezvousController.FindAll);
router.get('/rendezvous/:id', passport.authenticate("jwt", { session: false }), RendezvousController.FindOne);
router.patch('/rendezvous/:id', passport.authenticate("jwt", { session: false }), RendezvousController.UpdateOne);
router.delete('/rendezvous/:id', passport.authenticate("jwt", { session: false }), RendezvousController.DeleteOne);
router.put('/rendezvous/:id/cancel', RendezvousController.cancelRendezvous);

module.exports = router;
