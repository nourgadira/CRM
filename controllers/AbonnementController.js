const mongoose = require('mongoose');
const abonnementModel = require('../models/Abonnememnt'); // Assurez-vous que le chemin est correct
const createAbonnement = async (req, res) => {
  try {
    const exist = await abonnementModel.findOne(req.body)
    if (exist) {
      return res.status(409).json({ message: 'abonnementModel already exist' });
    }

    const newAbonnment = await abonnementModel.create(req.body)
    return res.status(201).json({
      success: true,
      message: " abonnementModel ajouté avec succès",
      data: newAbonnment,
    });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse avec le détail de l'erreur
    return res.status(400).json({ error: 'Impossible de créer l\'newAbonnment ', details: error.message });
  }
}

const findAllAbonnements = async (req, res) => {
  try {
    const data = await abonnementModel.find();
    return res.send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findAbonnementById = async (req, res) => {
  try {
    const data = await abonnementModel.findOne({ _id: req.params.id });
    return res.send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateAbonnement = async (req, res) => {
  try {
    const data = await abonnementModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteAbonnement = async (req, res) => {
  try {
    await abonnementModel.deleteOne({ _id: req.params.id });
    return res.send("Success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAbonnement,
  findAllAbonnements,
  findAbonnementById,
  updateAbonnement,
  deleteAbonnement,
};
