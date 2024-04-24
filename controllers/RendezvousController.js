const Rendezvous = require('../models/rendezVous'); // Assurez-vous que le chemin du modèle est correct
const Client = require('../models/Client'); // Assurez-vous que le chemin du modèle est correct

// Créer un nouveau rendez-vous
const createRendezvous = async (req, res) => {
  try {
    const { clientId, dateHeure, type, confirmation, lieu, langue } = req.body; // Assurez-vous que clientId est inclus dans le corps de la requête
    if (!clientId || !dateHeure || !type || !lieu || !langue) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newRendezvous = new Rendezvous({
      clientId,
      dateHeure,
      type,
      confirmation: confirmation || false,
      lieu,
      langue,
    });
    const savedRendezvous = await newRendezvous.save();
    console.log('Rendez-vous créé avec ID:', savedRendezvous._id);
    res.status(201).json(savedRendezvous);
  } catch (err) {
    console.error('Erreur lors de la création du rendez-vous:', err);
    res.status(500).json({ message: err.message });
  }
};
const getRendezvousById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('ID du rendez-vous à rechercher :', id);

    // Utilisez la méthode findById de Mongoose pour trouver le rendez-vous par son ID
    const rendezvous = await Rendezvous.findById(req.params.id);

    console.log('Rendez-vous trouvé :', rendezvous);

    if (!rendezvous) {
      // Si aucun rendez-vous n'est trouvé avec cet ID, renvoyez une réponse 404 (Not Found)
      return res.status(404).json({ message: 'Rendezvous not found' });
    }

    // Si le rendez-vous est trouvé, renvoyez-le en tant que réponse
    res.status(200).json(rendezvous);
  } catch (error) {
    // En cas d'erreur lors de la recherche du rendez-vous, renvoyez une réponse 500 (Internal Server Error)
    console.error('Error fetching rendezvous by ID:', error);
    res.status(500).json({ message: 'Error fetching rendezvous' });
  }
};
const annulerRendezvous = async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver le rendez-vous dans la base de données par son ID et mettre à jour le champ 'annule' à true
    const rendezvous = await Rendezvous.findByIdAndUpdate(id, { annule: true }, { new: true });

    if (!rendezvous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    console.log('Rendez-vous annulé avec succès:', rendezvous);
    res.status(200).json({ message: 'Rendez-vous annulé avec succès', rendezvous });
  } catch (error) {
    console.error('Erreur lors de l\'annulation du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation du rendez-vous' });
  }
};

// Obtenir tous les rendez-vous
const getAllRendezvous = async (req, res) => {
  try {
    const date = req.query.date; // Ajouter cette ligne pour obtenir la date depuis la requête
    const rendezvous = await Rendezvous.find({ date: date }); // Utiliser la variable 'date' pour la recherche
    res.status(200).json(rendezvous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
};

const getRendezvousForClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    // Utilisez l'ID du client pour trouver ses rendez-vous dans la base de données
    const rendezvous = await Rendezvous.find({ clientId: clientId });
    res.status(200).json(rendezvous);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous pour le client:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des rendez-vous.' });
  }
};

 
const updateRendezvous = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID du rendez-vous depuis les paramètres de la requête
    const { dateHeure, type, confirmation, lieu, langue } = req.body; // Récupérer les nouvelles valeurs depuis le corps de la requête
    // Vérifier si l'ID est valide
    if (!id) {
      return res.status(400).json({ message: 'ID de rendez-vous invalide' });
    }
    // Trouver le rendez-vous dans la base de données et mettre à jour ses valeurs
    const updatedRendezvous = await Rendezvous.findByIdAndUpdate(
      id,
      { dateHeure, type, confirmation, lieu, langue },
      { new: true } // Pour retourner le document mis à jour
    );
    // Vérifier si le rendez-vous a été trouvé et mis à jour avec succès
    if (!updatedRendezvous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    console.log('Rendez-vous mis à jour avec ID:', updatedRendezvous._id);
    res.status(200).json(updatedRendezvous);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', err);
    res.status(500).json({ message: err.message });
  }
  };
  module.exports = {
    createRendezvous,
    getAllRendezvous,
    getRendezvousForClient,
    updateRendezvous,
    getRendezvousById,
    annulerRendezvous,
  };