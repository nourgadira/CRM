const express = require('express');
const router = express.Router();
const TacheControlleur = require('../controllers/TacheControlleur');
const authenticateToken = require('../midellawers/authenticateToken');
const Tache = require('../models/Tache');


// Définissez les routes à l'aide de l'objet router
router.post('/taches/create', TacheControlleur.createTache);
router.get('/taches/:etatTache', TacheControlleur.getAllTaches); // Route pour obtenir toutes les tâches
router.get('/taches/:id', TacheControlleur.getTacheById); // Route pour obtenir une tâche par ID
router.put('/taches/:id', TacheControlleur.updateTache); // Route pour mettre à jour une tâche par ID
router.delete('/taches/:id', TacheControlleur.deleteTache); // Route pour supprimer une tâche par ID
router.post('/api/taches/:idTache/affecter/:idDeveloppeur', TacheControlleur.affecterTache);
router.get('/taches/user/:userId/:etatTache', TacheControlleur.getTacheByUserId);
router.get('/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const taskDetails = await Tache.findById(taskId).populate('projet idDeveloppeur');
      res.json(taskDetails);
    } catch (error) {
      console.error('Error fetching task details:', error);
      res.status(500).json({ message: 'Error fetching task details' });
    }
  });
  router.get('/taskProgressByState', TacheControlleur.getTaskProgressByState);
  router.get('/developpeurs', TacheControlleur.getDeveloppeursSeulement);

  router.get('/user/:userId/all', async (req, res) => {
    try {
      const userId = req.params.userId;
      const tasks = await Task.find({ idDeveloppeur: userId });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  router.post('/taches/assign/:taskId/:developerId', TacheControlleur.assignTaskToDeveloper);

module.exports = router;
