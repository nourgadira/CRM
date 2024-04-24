const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/RendezvousController');

router.post('/rendezvous', rendezvousController.createRendezvous);
router.get('/rendezvous', rendezvousController.getAllRendezvous);
router.get('/rendezvous/:clientId', rendezvousController.getRendezvousForClient);
router.put('/rendezvous/:id', rendezvousController.updateRendezvous);
router.get('/rendezvous/:id', rendezvousController.getRendezvousById);;
router.put('/rendezvous/:id/annuler', rendezvousController.annulerRendezvous);;

module.exports = router;
