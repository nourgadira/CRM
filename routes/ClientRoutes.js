const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const passport = require('passport');
// Routes pour les utilisateurs
router.post('/clients', ClientController.AddClient);
router.get('/clients/archived', ClientController.getArchivedClients);

router.get('/clients', ClientController.FindAll);
router.get('/clients/:id', ClientController.FindOne);
router.patch('/clients/:id', ClientController.UpdateOne);
router.delete('/clients/:id', ClientController.DeleteOne);
module.exports = router;
