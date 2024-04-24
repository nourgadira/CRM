const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');
const Client = require('../models/Client'); // Importez le modèle Client

// Route POST pour créer un nouveau client
router.post('/clients', clientController.createClient);

// Route GET pour récupérer tous les clients
router.get('/clients', clientController.getAllClients);

// Route GET pour récupérer un client par ID
router.get('/client/:clientId', async (req, res) => {
    try {
      const clientId = req.params.clientId;
  
      // Utilisez populate('projetsIds') pour récupérer le client avec ses projets associés
      const client = await Client.findById(clientId).populate('projetsIds').exec();
  
      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }
      res.status(200).json({ client });
    } catch (error) {
      console.error('Erreur lors de la récupération du client avec projets :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du client avec projets.' });
    }
  });

// Route PUT pour mettre à jour un client par ID
router.put('/clients/:clientId', clientController.updateClient);

// Route DELETE pour supprimer un client par ID
router.delete('/clients/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Vérifier si le client existe
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }

    // Supprimer le client de la base de données
    await Client.findByIdAndDelete(clientId);
    res.status(200).json({ message: 'Client supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du client.' });
  }
});
// Route GET pour récupérer tous les clients avec leurs projets associés
router.get('/clients-with-projects', clientController.getClientsWithProjects);

module.exports = router;
