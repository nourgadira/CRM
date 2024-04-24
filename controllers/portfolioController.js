const Portfolio = require('../models/Portfolio');
const axios = require('axios');
const Client = require('../models/Client');

const portfolioController = {
    createPortfolio: async (req, res) => {
        try {
            const { clientId, description } = req.body;
            if (!clientId || !description) {
                return res.status(400).json({ message: 'Client ID and description are required' });
            }
            
            // Fetch the client's name from the database
            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            
            // Create the portfolio with the client's name if available, otherwise just 'Portfolio'
            const name = client.name ? `Portfolio pour ${client.name}` : 'Portfolio';
            const newPortfolio = await Portfolio.create({ name, description });
            res.status(201).json(newPortfolio);
        } catch (error) {
            console.error('Error creating portfolio:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    addProjectToPortfolio: async (req, res) => {
        try {
            const { portfolioId, projectId } = req.body;
            const portfolio = await Portfolio.findById(portfolioId);
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }
            portfolio.projects.push(projectId);
            await portfolio.save();
            res.status(200).json({ message: 'Project added to portfolio successfully' });
        } catch (error) {
            console.error('Error adding project to portfolio:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    getAllProjectsInPortfolio: async (req, res) => {
        try {
            const { portfolioId } = req.params;
            const portfolio = await Portfolio.findById(portfolioId).populate('projects');
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }
            res.json(portfolio.projects);
        } catch (error) {
            console.error('Error fetching projects in portfolio:', error); // Log the error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    
    getAllPortfolios: async (req, res) => {
        try {
            const portfolios = await Portfolio.find().populate('projects').populate('client'); // Populate the client field
            res.json(portfolios);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    
    viewClientPortfolio: async (req, res) => {
        try {
            const clientId = req.params.clientId;
            const clientPortfolio = await Portfolio.findOne({ client: clientId }).populate('projects');
            if (!clientPortfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }
            res.json(clientPortfolio);
        } catch (error) {
            console.error('Error fetching client portfolio:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    getAllPortfoliosForClient: async (req, res) => {
        try {
            const clientId = req.params.clientId;
            const portfolios = await Portfolio.find({ client: clientId }).populate('projects');
            res.json(portfolios);
        } catch (error) {
            console.error('Error fetching portfolios for client:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
   
    
    
      getPortfoliosForClient: async (req, res) => {
        try {
            const clientId = req.params.clientId;
            const portfolios = await Portfolio.find({ client: clientId }).populate('projects');
            res.json(portfolios);
        } catch (error) {
            console.error('Error fetching portfolios for client:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};
module.exports = portfolioController;
