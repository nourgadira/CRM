const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const multer = require('multer');
// Configuration de multer pour gérer les fichiers joints
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Le dossier où enregistrer les fichiers joints
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Utilisez le nom original du fichier
    }
});
const upload = multer({ storage: storage });

router.post('/uploads', UserController.upload);
// Routes pour les utilisateurs
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.store); // Cette ligne a besoin d'une fonction de rappel dans UserController.store
router.get('/users/etat/:etat', UserController.getAllUsers);
router.patch('/users/:id', UserController.updateUserById);
router.delete('/users/:id/:etat', UserController.deleteUserById);
router.put('/users/:userId/rating/:newRating', UserController.updateRating);
router.get('/user', UserController.getLoggedInUser);
router.put('/users/:id/archive', UserController.updateUserArchive);
router.get('/developpeurs', UserController.getDeveloppeurs);
router.put('/users/:userId/update-state', UserController.updateUserState);

module.exports = router;
