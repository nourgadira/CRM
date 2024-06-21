// ratings.routes.js

const express = require('express');
const router = express.Router();

// Route pour enregistrer une note
router.post('/ratings', protectRoute, async (req, res) => {
    try {
        const { userId, value } = req.body;
        const rating = new Rating({ userId, value });
        await rating.save();
        res.status(201).json({ success: true, rating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de la note' });
    }
});

module.exports = router;

