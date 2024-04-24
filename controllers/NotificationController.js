const Notification = require('../models/Notification');

exports.getNotificationsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    console.log('UserID:', userId); // Afficher l'ID de l'utilisateur reçu dans la requête
    const notifications = await Notification.find({ idDeveloppeur: userId });
    console.log('Notifications:', notifications); // Afficher les notifications récupérées
    res.json(notifications);
  } catch (err) {
    console.error('Erreur lors de la récupération des notifications:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications pour cet utilisateur' });
  }
};

exports.createNotification = async (req, res) => {
    try {
        const { idDeveloppeur, taskId, message } = req.body;

        // Vérifier si l'ID du développeur, de la tâche et le message sont présents dans la requête
        if (!idDeveloppeur || !taskId || !message) {
            return res.status(400).json({ message: 'ID du développeur, de la tâche et message requis pour créer la notification' });
        }

        // Créer la notification dans la base de données avec l'ID de la tâche
        const newNotification = new Notification({ idDeveloppeur, taskId, message });
        await newNotification.save();

        res.status(201).json({ message: 'Notification créée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la notification' });
    }
};

exports.sendNotification = async (req, res) => {
    try {
        const { idDeveloppeur, taskId, message } = req.body;

        // Vérifiez si l'ID du développeur, de la tâche et le message sont présents dans la requête
        if (!idDeveloppeur || !taskId || !message) {
            return res.status(400).json({ message: 'ID du développeur, de la tâche et message requis pour envoyer la notification' });
        }

        // Ici, vous pouvez envoyer la notification au développeur concerné
        // Pour cet exemple, nous supposons que l'envoi de la notification est effectué avec succès
        res.status(200).json({ message: 'Notification envoyée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de la notification' });
    }
};


exports.markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification' });
  }
};
