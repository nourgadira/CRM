const mongoose = require('mongoose');
const noteModel = require('../models/note'); // Assurez-vous que le chemin est correct

const AddNotes = async (req, res) => {
    try {
        // Vérifier si req.user et req.user._id sont définis
        if (req.user && req.user._id) {
            const newNotes = await noteModel.create({
                sender: req.user._id,
                ...req.body
            });
            // Réponse JSON indiquant que la note a été créée avec succès
            return res.status(201).json({
                success: true,
                message: "Note ajoutée avec succès",
                data: newNotes,
            });
        } else {
            // Utilisateur non authentifié
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse avec le détail de l'erreur
        return res.status(400).json({ error: 'Impossible de créer la note', details: error.message });
    }
}
const FindAll = async (req, res) => {
    const taskId = req.query.taskId
    try {
        const data = await noteModel.find({ taskId: taskId }).populate('sender')
        return res.send(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const FindOne = async (req, res) => {
    try {
        const data = await noteModel.findOne({ _id: req.params.id })
        return res.send(data)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const UpdateOne = async (req, res) => {

    try {


        const data = await noteModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true })
        return res.send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

const DeleteOne = async (req, res) => {
    try {
        const data = await noteModel.deleteOne({ _id: req.params.id })
        return res.send("success")
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



module.exports = {
    AddNotes,
    FindAll,
    FindOne,
    UpdateOne,
    DeleteOne,
}
