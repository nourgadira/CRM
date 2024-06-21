
const ClientModel = require('../models/Client'); // Assurez-vous que le chemin est correct
const portfolioModel = require('../models/Portfolio');
const Projet = require('../models/Projet');

const AddClient = async (req, res) => {
  try {
    const newUser = await ClientModel.create(req.body)
    // Configurer le transporter Nodemailer
    const portfolio = await portfolioModel.create({
      name: `Portfolio pour ${newUser.name}`,
      description: 'Description du portfolio',
      client: newUser._id,
    })
    // Réponse JSON indiquant que l'utilisateur a été créé avec succès
    return res.status(201).json({
      success: true,
      message: "Utilisateur ajouté avec succès",
      data: newUser,
    });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse avec le détail de l'erreur
    return res.status(400).json({ error: 'Impossible de créer l\'utilisateur', details: error.message });
  }
}
const getArchivedClients = async (req, res) => {
  try {
    // Utilisez votre modèle Client pour rechercher les clients archivés dans la base de données
    const archivedClients = await Client.find({ archived: true }); // Assurez-vous que votre modèle Client a un champ "archived" pour indiquer si le client est archivé

    // Envoyez la liste des clients archivés en tant que réponse
    res.json(archivedClients);
  } catch (err) {
    // En cas d'erreur, renvoyez une réponse avec le code d'erreur approprié et un message d'erreur
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients archivés.' });
  }
};

const FindAll = async (req, res) => {
  try {
    const data = await ClientModel.find({ archive: false })
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const FindOne = async (req, res) => {
  try {
    const data = await ClientModel.findOne({ _id: req.params.id })
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const UpdateOne = async (req, res) => {

  try {
    const data = await ClientModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true })
    return res.send(data)


  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}

const DeleteOne = async (req, res) => {
  try {
    const data = await ClientModel.findOneAndUpdate({ _id: req.params.id }, { $set: { archive: true } }, { new: true })
    await Projet.updateMany({ clientId: req.params.id }, { status: 1 }, { new: true })
    return res.send("success")
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}






module.exports = {
  AddClient,
  FindAll,
  FindOne,
  UpdateOne,
  DeleteOne,
  getArchivedClients,

}
