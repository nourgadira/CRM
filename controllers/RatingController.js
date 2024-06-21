// rating.controller.js

const Rating = require('../models/Rating');

// Contrôleur pour enregistrer une note
exports.createRating = async (req, res) => {
    try {
        const { userId, value } = req.body;
        const rating = new Rating({ userId, value });
        await rating.save();
        res.status(201).json({ success: true, rating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de la note' });
    }
};

// Contrôleur pour obtenir la moyenne des notes d'un utilisateur
exports.getAverageRating = async (req, res) => {
    try {
        const userId = req.params.userId;
        const ratings = await Rating.find({ userId });
        const totalRatings = ratings.length;
        if (totalRatings === 0) {
            return res.status(404).json({ success: false, message: 'Aucune note trouvée pour cet utilisateur' });
        }
        const sumRatings = ratings.reduce((acc, curr) => acc + curr.value, 0);
        const averageRating = sumRatings / totalRatings;
        res.status(200).json({ success: true, averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des notes' });
    }
};
