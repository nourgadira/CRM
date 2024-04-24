const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController'); // Vérifiez le chemin d'importation

// Routes pour les notifications
router.get('/notifications/user/:userId', notificationController.getNotificationsByUserId);
router.post('/notifications', notificationController.createNotification);
router.put('/notifications/:notificationId/mark-as-read', notificationController.markNotificationAsRead);
router.post('/send', notificationController.sendNotification);

module.exports = router;
