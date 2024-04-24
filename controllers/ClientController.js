const Projet = require('../models/Projet');
const Client = require('../models/Client');

const addRendezvousToClient = async (req, res) => {
  const { clientId } = req.params; // Récupérez l'ID du client depuis les paramètres d'URL
  const { dateHeure, type, lieu, langue } = req.body; // Récupérez les données du formulaire depuis le corps de la requête

  try {
    // Recherchez le client correspondant dans la base de données
    const client = await Client.findById(clientId);

    // Vérifiez si le client existe
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Ajoutez le rendez-vous au tableau de rendez-vous du client
    client.rendezvous.push({ dateHeure, type, lieu, langue });
    
    // Enregistrez les modifications dans la base de données
    await client.save();

    // Répondez avec le rendez-vous ajouté
    res.status(201).json({ message: 'Rendezvous added to client', rendezvous: client.rendezvous });
  } catch (error) {
    console.error('Error adding rendezvous to client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const clientController = {
  // Enregistrer un client avec projets associés
  saveClientWithProjects: async (req, res) => {
    try {
      const { nom, numero, etat, notes, nomentreprise, pays, cin, adresse, projetsIds } = req.body;

      // Vérifier que les IDs de projets sont valides
      const projectsExist = await Projet.find({ _id: { $in: projetsIds } });
      if (projectsExist.length !== projetsIds.length) {
        return res.status(400).json({ error: 'Certains projets sont invalides' });
      }

      // Créer un nouveau client avec les données fournies
      const newClient = new Client({
        nom,
        numero,
        etat,
        notes,
        nomentreprise,
        pays,
        cin,
        adresse,
        projetsIds, // Utiliser projetsIds pour ajouter les IDs des projets au client
      });

      // Enregistrer le client dans la base de données
      const savedClient = await newClient.save();

      res.status(201).json({ message: 'Client créé avec succès', client: savedClient });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du client', message: error.message });
    }
  },
  
  
   getTopClients : async (req, res) => {
    try {
      // Utilisation de MongoDB avec Mongoose pour effectuer la requête
      const clients = await Client.aggregate([
        {
          $lookup: {
            from: 'projets', // Nom de la collection des projets
            localField: '_id',
            foreignField: 'clientId',
            as: 'projets',
          },
        },
        {
          $match: {
            'projets.5': { $exists: true }, // Vérifie s'il y a au moins 6 projets (indice 0 à 5)
          },
        },
      ]);
  
      res.json(clients);
    } catch (error) {
      console.error('Error fetching top clients:', error);
      res.status(500).json({ message: 'Error fetching top clients' });
    }
  },

  // Obtenir tous les clients avec leurs projets associés
  getClientsWithProjects: async (req, res) => {
    try {
      const clients = await Client.find().populate('projetsIds');

      res.status(200).json({ clients });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des clients avec projets.', message: error.message });
    }
  },

  // Obtenir un client par son ID avec ses projets associés
  getClientById: async (req, res) => {
    try {
      const { clientId } = req.params;
      const client = await Client.findById(clientId).populate('projetsIds');
      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de récupérer le client', message: error.message });
    }
  },

  // Obtenir les projets associés à un client par son ID
  getClientProjects: async (req, res) => {
    try {
      const { clientId } = req.params;

      // Récupérer le client par son ID
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      // Récupérer les projets associés au client
      const projects = await Projet.find({ _id: { $in: client.projetsIds } });
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de récupérer les projets du client', message: error.message });
    }
  },

  // Créer un client sans projets associés
  createClient: async (req, res) => {
    try {
        // Logique de création du client
        const newClient = await Client.create(req.body);

        // Logique de création du portfolio associé au client
        const newPortfolio = await Portfolio.create({
            name: `Portfolio pour ${newClient.name}`,
            description: 'Description du portfolio',
            client: newClient._id,
        });

        res.status(201).json({ client: newClient, portfolio: newPortfolio });
    } catch (error) {
        console.error('Error creating client and portfolio:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},

  // Obtenir tous les clients
  getAllClients: async (req, res) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de récupérer les clients', message: error.message });
    }
  },

  // Mettre à jour un client
  updateClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const { nom, numero, etat, notes, nomentreprise, pays, cin, adresse } = req.body;
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { nom, numero, etat, notes, nomentreprise, pays, cin, adresse },
        { new: true }
      );
      if (!updatedClient) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }
      res.status(200).json({ message: 'Client mis à jour avec succès', client: updatedClient });
    } catch (error) {
      res.status(500).json({ error: 'Impossible de mettre à jour le client', message: error.message });
    }
  },

  // Supprimer un client
  deleteClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const deletedClient = await Client.findByIdAndDelete(clientId);
      if (!deletedClient) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }
      res.status(200).json({ message: 'Client supprimé avec succès', client: deletedClient });
    } catch (error) {
      res.status(500).json({ error: 'Impossible de supprimer le client', message: error.message });
    }
  },
};

module.exports = clientController;
