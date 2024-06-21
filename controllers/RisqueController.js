const mongoose = require('mongoose');
const risqueModel = require('../models/Risque'); // Assurez-vous que le chemin est correct
const Projet = require('../models/Projet');
const TaskModel = require('../models/Tache'); // Assurez-vous que le chemin est correct
const nodemailer = require('nodemailer');
const Risque = require('../models/Risque');

// Assurez
const AddRisque = async (req, res) => {
    try {
        const risque = await risqueModel.create(req.body)

        const tasks = await TaskModel.find({ etat: "todo" }).populate('developpeur');

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: "isetkr9@gmail.com",
                pass: "rmzwhxeoqiugbblz",
            },
        });

        await transporter.sendMail({
            from: "devit@gmail.com",
            to: tasks.map(t => t.developpeur.email).join(','),
            subject: "Nouveau risque créé",
            html: `
                     <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
                       <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px;">
                      <h1 style="text-align: center; font-size: 30px; margin-bottom: 20px; font-weight: 600; color: #333333;">
                           Notification de nouvelle création de risque
                        </h1>
                        
                        <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
                          Un nouveau risque a été créé qui pourrait être pertinent pour vos tâches en cours. Veuillez vérifier les détails ci-dessous :
                       </p>
                        <ul style="list-style-type: none; padding-left: 0;">
                         <li><strong>Email:</strong> ${req.body.email}</li>
                          <li><strong>Nom du risque:</strong> ${req.body.name}</li>
                           <li><strong>Description:</strong> ${req.body.description}</li>
                        </ul>
                        <p style="font-size: 12px; color: #333333;">
                           Merci de prendre les mesures nécessaires.
                       </p>
                         <p style="font-size: 12px; color: #fff; font-weight: bold; background-color: #333333; padding: 10px; border-radius: 5px;">
                           Merci et bonne journée !
                         </p>
                       </div>
                    </div>
                  `,
        });
        res.send(tasks)
    }


    catch (error) {
        return res.status(400).json({ error: 'Impossible de créer le Risque', details: error.message });
    }
};


const FindAll = async (req, res) => {
    try {
        const data = await risqueModel.find()
            .populate({
                path: 'projet',
                populate: {
                    path: 'chefProjet',
                    model: 'User' // Assuming your user model is named 'User'
                }
            });
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const FindOne = async (req, res) => {
    try {
        const Risque = await risqueModel.findById(req.params.id);
        if (!Risque) {
            return res.status(404).send({ message: 'Risque sélectionné invalide.' });
        }
        res.status(200).send({ paiement });
    } catch (error) {
        console.error('Error getting Risque by ID:', error);
        res.status(500).send({ message: 'Error getting Risque by ID', error: error.message });
    }
};
const UpdateOne = async (req, res) => {
    try {
        const data = await risqueModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const DeleteOne = async (req, res) => {
    try {
        const data = await risqueModel.deleteOne({ _id: req.params.id });
        return res.send("success");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const getRisqueByProjectId = async (req, res) => {
    try {
        const projectId = req.params.id;
        const risques = await Risque.find({ projetId: projectId });

        if (!risques.length) {
            return res.status(404).json({ message: 'Aucun Risque trouvé pour ce projet' });
        }

        res.status(200).json(paiements);
    } catch (error) {
        console.error("Erreur lors de la récupération des Risque :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }

};

module.exports = {
    AddRisque,
    FindAll,
    FindOne,
    UpdateOne,
    DeleteOne,
    getRisqueByProjectId,
};
