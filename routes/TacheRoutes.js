const express = require('express');
const router = express.Router();
const { TaskController } = require('../controllers/TacheControlleur');
const passport = require('passport');
// Routes pour les utilisateurs
router.post('/tasks', TaskController.AddTask);
router.get('/tasks', passport.authenticate("jwt", { session: false }), TaskController.FindAll);
router.get('/tasks/:id', passport.authenticate("jwt", { session: false }), TaskController.FindOne);
router.patch('/tasks/:id', passport.authenticate("jwt", { session: false }), TaskController.UpdateOne);
router.delete('/tasks/:id', passport.authenticate("jwt", { session: false }), TaskController.DeleteOne);
module.exports = router;
