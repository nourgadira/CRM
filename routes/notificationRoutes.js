const express = require('express');
const router = express.Router();
const { notificationController } = require('../controllers/NotificationController'); // Vérifiez le chemin d'importation
const passport = require('passport');
// Routes pour les notifications
router.get('/notifications', passport.authenticate("jwt", { session: false }), notificationController.GetNotifications);
router.post('/read', passport.authenticate("jwt", { session: false }), notificationController.ReadNotifications);

module.exports = router;
