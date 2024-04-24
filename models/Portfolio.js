const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
  
  },
  description: {
    type: String,
  
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Assurez-vous que c'est le même que le modèle Client
    required: true,
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
  }],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;