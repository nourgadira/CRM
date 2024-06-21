const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const passport = require('passport');
const UserModel = require('../models/User');

// Routes pour les utilisateurs
router.post('/users', UserController.AddUser);
router.get('/users', UserController.FindAll);
router.get('/users/:id', UserController.FindOne);
router.patch('/users/:id', UserController.UpdateOne);
router.put('/users/rating/:id', UserController.UpdateRating); // Nouvelle route pour UpdateRating
router.delete('/users/:id', passport.authenticate("jwt", { session: false }), UserController.DeleteOne);
router.post('/upload_image', passport.authenticate("jwt", { session: false }), UserController.upload);

module.exports = router;
