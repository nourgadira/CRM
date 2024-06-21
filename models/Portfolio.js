const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Assurez-vous que c'est le même que le modèle Client
    required: true,
  },
}, {
  timestamps: true
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;