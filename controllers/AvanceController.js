const mongoose = require('mongoose');
const avanceModel = require('../models/Avance');
const Projet = require('../models/Projet');
const Avance = require('../models/Avance');

const AddAvance = async (req, res) => {
    try {
        const { typeavance, avance, projetId } = req.body;

        // Vérifiez que le projet existe
        const projet = await Projet.findById(projetId);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Créez et enregistrez une nouvelle avance
        const nouvelleAvance = new Avance({
            avance,
            projetId,
            typeavance,
        });
        await nouvelleAvance.save();

        res.status(201).json(nouvelleAvance);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const FindAll = async (req, res) => {
    try {
        const data = await avanceModel.find();
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const FindOne = async (req, res) => {
    try {
        const data = await avanceModel.findOne({ _id: req.params.id });
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const UpdateOne = async (req, res) => {
    try {
        const data = await avanceModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true });
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const DeleteOne = async (req, res) => {
    try {
        const data = await avanceModel.deleteOne({ _id: req.params.id });
        return res.send("success");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const CalculateResteAPayer = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Récupérer toutes les avances associées au projet
        const avances = await avanceModel.find({ projetId });

        // Calculer le total des avances
        let totalAvances = 0;
        avances.forEach(avance => {
            totalAvances += parseFloat(avance.avance) || 0;
        });

        // Récupérer le montant total du projet (remplacez cela par votre logique de récupération du montant total du projet)
        const montantTotalProjet = 1000; // Exemple de montant total du projet

        // Calculer le reste à payer
        const resteAPayer = montantTotalProjet - totalAvances;

        // Retourner le reste à payer en réponse
        return res.status(200).json({ resteAPayer });
    } catch (error) {
        return res.status(500).json({ error: 'Impossible de calculer le reste à payer', details: error.message });
    }
};

module.exports = {
    AddAvance,
    CalculateResteAPayer,
    FindAll,
    FindOne,
    UpdateOne,
    DeleteOne,
};
