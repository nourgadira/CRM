const express = require('express');
const router = express.Router();
const NotesController = require('../controllers/NotesController');
const passport = require('passport');
// Routes pour les paiements
router.post('/notes', passport.authenticate("jwt", { session: false }), NotesController.AddNotes);
router.get('/notes', passport.authenticate("jwt", { session: false }), NotesController.FindAll);
router.get('/notes/:id', NotesController.FindOne);
router.patch('/notes/:id', passport.authenticate("jwt", { session: false }), NotesController.UpdateOne);
router.delete('/notes/:id', passport.authenticate("jwt", { session: false }), NotesController.DeleteOne);
module.exports = router;
