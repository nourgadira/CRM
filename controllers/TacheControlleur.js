const mongoose = require('mongoose');
const Tache = require('../models/Tache');
const User = require('../models/User');

const TacheControlleur = {
  createTache: async (req, res) => {
    try {
      const { etat, description, dateDebut, dateFin, projetId } = req.body;

      // Vérifiez que le projetId est fourni
      if (!projetId) {
        return res.status(400).json({ message: "Le projet est requis pour créer une tâche." });
      }

      // Créez la tâche avec le projet
      const newTache = new Tache({
        etat,
        description,
        dateDebut,
        dateFin,
        projet: projetId, // Utilisez le projetId pour associer la tâche au projet
      });

      // Enregistrez la nouvelle tâche
      await newTache.save();
      res.status(201).json({ message: "Tâche créée avec succès", tache: newTache });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
      res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
  },

  getProjetsByTacheId: async (req, res) => {
    try {
      const tacheId = req.params.tacheId;
      const tache = await Tache.findById(tacheId).populate('projet').populate('idDeveloppeur');
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      const projet = tache.projet;
      res.json(projet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération du projet associé à la tâche', error: err.message });
    }
  },

  getAllTachesForRoleTwo: async (req, res) => {
    try {
      const taches = await Tache.find(); // Récupérer toutes les tâches
      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
    }
  },

  getAllTaches: async (req, res) => {
    try {
      const etatTache = req.params.etatTache;
      let taches;
      if (etatTache) {
        taches = await Tache.find({ etat: etatTache }).populate('idDeveloppeur');
      } else {
        taches = await Tache.find().populate('idDeveloppeur'); // Utilisation de populate pour obtenir les données du projet associé à chaque tâche
      }

      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
    }
  },

  getTacheByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const etatTache = req.params.etatTache;
      let taches;

      if (etatTache === 'all') {
        taches = await Tache.find({ idDeveloppeur: userId });
      } else {
        taches = await Tache.find({ idDeveloppeur: userId, etat: etatTache });
      }

      res.json(taches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches de l\'utilisateur', error: err.message });
    }
  },

  getTacheById: async (req, res) => {
    try {
      const tache = await Tache.findById(req.params.id).populate('projet');
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.json(tache);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateTache: async (req, res) => {
    try {
      const { etat, description, dateDebut, dateFin, idDeveloppeur, idProjet } = req.body;
      const tache = await Tache.findById(req.params.id);
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      tache.etat = etat;
      tache.description = description;
      tache.dateDebut = dateDebut;
      tache.dateFin = dateFin;
      tache.idDeveloppeur = idDeveloppeur;
      tache.idProjet = idProjet; // Ajout de l'ID du projet
      const tacheMiseAJour = await tache.save();
      res.json({ message: 'Tâche mise à jour avec succès', tache: tacheMiseAJour, idProjet: idProjet });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  assignTaskToDeveloper: async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const developerId = req.params.developerId;
      // Find the task by ID
      // const existingTask = await Tache.findOne({_id: taskId, idDeveloppeur: { $in: [developerId] }});
      const existingTask = await Tache.findById(taskId);

      // Check if the task exists
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      existingTask.idDeveloppeur.push(developerId);
      const tache = await existingTask.save();// Tache.findByIdAndUpdate(taskId, {idDeveloppeur: developerId});

      // Logique pour assigner la tâche au développeur
      // Par exemple, mettez à jour la base de données avec l'ID du développeur assigné à la tâche

      res.status(200).send("Tâche assignée avec succès au développeur.");
    } catch (error) {
      console.error("Erreur lors de l'assignation de la tâche au développeur:", error);
      res.status(500).send("Erreur lors de l'assignation de la tâche au développeur.");
    }
  },

  getDeveloppeurs: async (req, res) => {
    try {
      const developpeurs = await User.find({ role: 1 });
      res.status(200).json({ developpeurs });
    } catch (error) {
      console.error('Erreur lors de la récupération des développeurs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des développeurs', error: error.message });
    }
  },

  affecterTache: async (req, res) => {
    try {
      const { idTache, idDeveloppeur } = req.params;
      const tache = await Tache.findById(idTache);
      const developpeur = await User.findById(idDeveloppeur);
      if (!tache || !developpeur) {
        return res.status(404).json({ message: 'Tâche ou développeur non trouvé' });
      }
      tache.idDeveloppeur = idDeveloppeur;
      const tacheMiseAJour = await tache.save();
      const notification = new Notification({
        type: 'assignTask',
        userId: idDeveloppeur,
        taskId: idTache,
        message: `Vous avez une nouvelle tâche assignée : ${tache.description}`,
        date: new Date(),
        isRead: false,
      });
      await notification.save();

      res.json({ message: 'Tâche affectée avec succès au développeur', tache: tacheMiseAJour });
    } catch (error) {
      console.error('Erreur lors de l\'affectation de la tâche au développeur:', error);
      res.status(500).json({ message: 'Erreur lors de l\'affectation de la tâche au développeur', error: error.message });
    }
  },

  deleteTache: async (req, res) => {
    try {
      const tache = await Tache.findByIdAndDelete(req.params.id);
      if (!tache) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: error.message });
    }
  },

  getTacheByNom: async (req, res) => {
    try {
      const nomTache = req.params.nomTache;
      const taches = await Tache.find({ description: { $regex: nomTache, $options: 'i' } }).populate('projet').populate('idDeveloppeur');
      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches par nom', error: error.message });
    }
  },

  getTaskProgressByState: async (req, res) => {
    try {
      // Récupérer les tâches avec leurs états
      const tasks = await Tache.find();

      // Compter le nombre de tâches dans chaque état
      const taskCountByState = tasks.reduce((acc, task) => {
        acc[task.etat] = (acc[task.etat] || 0) + 1;
        return acc;
      }, {});

      // Calculer les pourcentages des états
      const totalTasks = tasks.length;
      const taskProgressByState = Object.keys(taskCountByState).map((etat) => ({
        etat,
        pourcentage: (taskCountByState[etat] / totalTasks) * 100,
      }));

      res.status(200).json(taskProgressByState);
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression des tâches par état:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de la progression des tâches par état' });
    }
  },

  getDeveloppeursSeulement: async (req, res) => {
    try {
      const developpeurs = await User.find({ role: 1 }); // Récupère les utilisateurs avec un rôle de développeur (rôle 1)
      res.status(200).json(developpeurs);
    } catch (error) {
      console.error('Erreur lors de la récupération des développeurs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des développeurs', error: error.message });
    }
  },

  getTachesByEtat: async (req, res) => {
    try {
      const etatTache = req.params.etatTache;
      let taches;
      if (etatTache === 'en_cours' || etatTache === 'a_faire' || etatTache === 'terminee') {
        taches = await Tache.find({ etat: etatTache }).populate('projet').populate('idDeveloppeur');
      } else {
        return res.status(400).json({ message: 'État de la tâche non valide' });
      }
      res.status(200).json(taches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tâches par état', error: error.message });
    }
  },
};

module.exports = TacheControlleur;
