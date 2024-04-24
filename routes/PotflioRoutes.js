const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Créer un portfolio
router.post('/portfolios', portfolioController.createPortfolio);

// Ajouter un projet à un portfolio
router.post('/portfolio/addProject', portfolioController.addProjectToPortfolio);

// Obtenir tous les projets d'un portfolio
router.get('/portfolio/:portfolioId/projects', portfolioController.getAllProjectsInPortfolio);

// Obtenir tous les portfolios
router.get('/portfolios', portfolioController.getAllPortfolios);

// Route pour voir le portfolio d'un client
router.get('/voirPortfolio/:clientId', portfolioController.viewClientPortfolio);
router.get('/clients/:clientId/portfolios', portfolioController.getPortfoliosForClient);

router.get('/portfolios/client/:clientId', portfolioController.getAllPortfoliosForClient);
module.exports = router;
