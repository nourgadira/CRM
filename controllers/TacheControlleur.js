const mongoose = require('mongoose');
const TaskModel = require('../models/Tache'); // Assurez-vous que le chemin est correct
const UserModel = require('../models/User');
const nodemailer = require('nodemailer');
const Note = require('../models/note');

const Projet = require('../models/Projet');

const AddTask = async (req, res) => {
  try {
    const exist = await TaskModel.findOne(req.body)
    if (exist) {
      return res.status(409).json({ message: 'tache already exist' });
    }

    const newTache = await TaskModel.create(req.body)
    return res.status(201).json({
      success: true,
      message: " tache ajouté avec succès",
      data: newTache,
    });

    // Configurer le transporter Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "isetkr9@gmail.com",
        pass: "rmzwhxeoqiugbblz",
      },
    });

    // Envoyer un e-mail de bienvenue à l'utilisateur avec les détails de la tâche
    const info = await transporter.sendMail({
      from: "isetkr9@gmail.com",
      to: user.email,
      subject: "Nouvelle tache assignée à toi",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px;">
            <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
              Nouvelle tâche assignée à toi :
            </p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Nom de la tâche:</strong> ${req.body.nom}</li>
              <li><strong>Date de début:</strong> ${req.body.dateDebut}</li>
              <li><strong>Date de fin:</strong> ${req.body.dateFin}</li>
            </ul>
            <p style="font-size: 12px; color: #fff; font-weight: bold;">
              Merci et bienvenue !
            </p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "Tâche ajoutée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la tâche" });
  }
}




const FindAll = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un développeur (rôle = 1)
    if (req.user.role === 1) {
      const tasks = await TaskModel.find({ developpeur: req.user._id }).populate("projet").populate("developpeur");
      return res.json(tasks);
    } else {
      // Si ce n'est pas un développeur, renvoyer toutes les tâches
      const allTasks = await TaskModel.find().populate("projet").populate("developpeur");
      return res.json(allTasks);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const FindOne = async (req, res) => {
  try {
    const data = await TaskModel.findOne({ _id: req.params.id }).populate("projet")
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const UpdateOne = async (req, res) => {

  try {


    const data = await TaskModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true }).populate("projet")
    //console.log("azerty", req.body)
    //console.log("id", req.params.id)
    const tasksprojets = await TaskModel.findOne({ _id: req.params.id }, { new: true }).populate("projet")
    //console.log("lalal", tasksprojets)
    const tasks = await TaskModel.find({ projet: tasksprojets.projet._id });
    console.log('tasks:', tasks)
    // Vérifiez si toutes les tâches sont dans l'état "done"
    const allTasksDone = tasks.every(task => task.etat === 'done');
    console.log('all tasks done:', allTasksDone)

    // Mettez à jour l'état du projet en conséquence
    const updatedProjet = await Projet.findByIdAndUpdate(tasksprojets.projet._id, { etat: allTasksDone ? 'fini' : 'en cours' }, { new: true });

    return res.send(data)


  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}

const DeleteOne = async (req, res) => {
  try {
    const data = await TaskModel.deleteOne({ _id: req.params.id })
    return res.send("success")
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports.TaskController = {
  AddTask,
  FindAll,
  FindOne,
  UpdateOne,
  DeleteOne,

}
