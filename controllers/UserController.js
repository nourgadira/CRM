const mongoose = require('mongoose');
const UserModel = require('../models/User'); // Assurez-vous que le chemin est correct
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const uploadImage = require("../utils/uploadImage")
const uploadFile = uploadImage.single('image')

const AddUser = async (req, res) => {
  try {
    // Créer un nouvel utilisateur
    const exist = await UserModel.findOne({ email: req.body.email })
    if (exist) {
      return res.status(409).json({ message: 'User already exist' });
    }
    const originalPassword = req.body.password
    const hash = await bcrypt.hash(req.body.password, 10)
    req.body.password = hash
    const newUser = await UserModel.create(req.body)
    // Configurer le transporter Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "isetkr9@gmail.com",
        pass: "rmzwhxeoqiugbblz",

      },
    });

    const info = await transporter.sendMail({
      from: "devit@gmail.com",
      to: req.body.email,
      subject: "Nouveau compte créé",
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px;">
              <h1 style="text-align: center; font-size: 30px; margin-bottom: 20px; font-weight: 600; color: #333333;">
                Bienvenue sur notre plateforme 
              </h1>
              <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
                Cher ${req.body.name},
              </p>
              <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
                Votre nouveau compte  a bien été créé. Voici vos informations de connexion :
              </p>
              <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Email:</strong> ${req.body.email}</li>
                <li><strong>Mot de passe:</strong> ${originalPassword}</li>
                <li><strong>Rôle:</strong> ${req.body.role}</li>
              </ul>
              <p style="font-size: 12px; color: #333333;">
                Utilisez ces informations pour accéder à votre compte .
              </p>
              <p style="font-size: 12px; color: #fff; font-weight: bold; background-color: #333333; padding: 10px; border-radius: 5px;">
                Merci et bienvenue !
              </p>
            </div>
          </div>
        `,
    });

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
const FindAll = async (req, res) => {
  try {
    const data = await UserModel.find()
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
const UpdateRating = async (req, res) => {
  try {
    const { id, rating } = req.body;
    if (!id || !rating) {
      return res.status(400).json({ error: 'ID and rating are required' });
    }

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.rating = rating;
    await user.save();

    return res.status(200).json({ success: true, message: 'Rating updated successfully', data: user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update rating', details: error.message });
  }
}

const FindOne = async (req, res) => {
  try {
    const data = await UserModel.findOne({ _id: req.params.id })
    return res.send(data)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const UpdateOne = async (req, res) => {

  try {


    const data = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true })
    return res.send(data)


  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}

const DeleteOne = async (req, res) => {
  try {
    const data = await UserModel.deleteOne({ _id: req.params.id })
    return res.send("success")
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


const upload = async (req, res) => {
  try {
    uploadFile(req, res, async function (err) {


      const image = {
        file: "http://localhost:8080/uploads/" + req.file.filename,
      };
      const user = await UserModel.findOneAndUpdate({ _id: req.query.id }, { image: image.file }, { new: true });
      res.send(user)
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }

}





module.exports = {
  UpdateRating,
  AddUser,
  FindAll,
  FindOne,
  UpdateOne,
  DeleteOne,
  upload,
  UpdateRating,
}
