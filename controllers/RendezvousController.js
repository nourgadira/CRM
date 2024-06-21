const mongoose = require('mongoose');
const RendezVous = require('../models/RendezVous');
// Assurez-vous que le chemin est correct
const AddRendezvous = async (req, res) => {
  try {
    const exist = await RendezVous.findOne(req.body)
    if (exist) {
      return res.status(409).json({ message: 'rendezvous already exist' });
    }

    const newRendezvous = await RendezVous.create(req.body)
    // Réponse JSON indiquant que l'utilisateur a été créé avec succès
    return res.status(201).json({
      success: true,
      message: " reendezvous ajouté avec succès",
      data: newRendezvous,
    });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse avec le détail de l'erreur
    return res.status(400).json({ error: 'Impossible de créer l\'rendezvous', details: error.message });
  }
}
const cancelRendezvous = async (req, res) => {
  try {
    const rendezvousId = req.params.id;

    // Vérifiez si le rendez-vous existe
    const rendezvous = await RendezVous.findById(rendezvousId);
    if (!rendezvous) {
      return res.status(404).json({ message: 'Rendezvous not found' });
    }

    // Vérifiez si le rendez-vous peut être annulé
    if (rendezvous.status !== 'confirmed') {
      return res.status(400).json({ message: 'Rendezvous cannot be canceled' });
    }

    // Mettez à jour le statut du rendez-vous à "canceled"
    rendezvous.status = 'canceled';
    await rendezvous.save();

    res.status(200).json({ message: 'Rendezvous canceled successfully', rendezvous });
  } catch (error) {
    console.error('Error canceling rendezvous:', error);
    res.status(500).json({ message: 'Error canceling rendezvous', error: error.message });
  }
};

const FindAll = async (req, res) => {
  try {
    const data = await RendezVous.find()
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const FindOne = async (req, res) => {
  try {
    const data = await RendezVous.findOne({ _id: req.params.id })
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const UpdateOne = async (req, res) => {

  try {


    const data = await RendezVous.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true })
    return res.send(data)


  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}

const DeleteOne = async (req, res) => {
  try {
    const data = await RendezVous.deleteOne({ _id: req.params.id })
    return res.send("success")
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}






module.exports = {
  cancelRendezvous,
  AddRendezvous,
  FindAll,
  FindOne,
  UpdateOne,
  DeleteOne,

}
