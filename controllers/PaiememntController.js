const mongoose = require('mongoose');
const paiememntModel = require('../models/Paiement'); // Assurez-vous que le chemin est correct
const Avance = require('../models/Avance'); // Assurez-vous que le chemin est correct
const Paiement = require('../models/Paiement'); // Assurez
const Projet = require('../models/Projet'); // Assurez-vous que le chemin d'accès est correct

const AddPaiement = async (req, res) => {
    try {
        const exist = await paiememntModel.findOne(req.body);
        if (exist) {
            return res.status(409).json({ message: 'Paiement déjà existant' });
        }

        const newPaiement = await paiememntModel.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Paiement ajouté avec succès",
            data: newPaiement,
        });
    } catch (error) {
        return res.status(400).json({ error: 'Impossible de créer le paiement', details: error.message });
    }
};

const FindAll = async (req, res) => {
    try {
        const data = await paiememntModel.find().populate("projet");
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const FindOne = async (req, res) => {
    try {
        const paiement = await paiememntModel.findById(req.params.id);
        if (!paiement) {
            return res.status(404).send({ message: 'Paiement sélectionné invalide.' });
        }
        res.status(200).send({ paiement });
    } catch (error) {
        console.error('Error getting paiement by ID:', error);
        res.status(500).send({ message: 'Error getting paiement by ID', error: error.message });
    }
};
const UpdateOne = async (req, res) => {
    try {
        const data = await paiememntModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};


const DeleteOne = async (req, res) => {
    try {
        const data = await paiememntModel.deleteOne({ _id: req.params.id });
        return res.send("success");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const getPaiementsByProjectId = async (req, res) => {
    try {
        const projectId = req.params.id;
        const paiements = await Paiement.find({ projetId: projectId });

        if (!paiements.length) {
            return res.status(404).json({ message: 'Aucun paiement trouvé pour ce projet' });
        }

        res.status(200).json(paiements);
    } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }

};


const calculerResteAPayer = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Récupérer les paiements pour ce projet
        const paiements = await Paiement.find({ projet: projectId });
        if (paiements.length === 0) {
            return res.status(404).json({ message: 'Aucun paiement trouvé pour ce projet' });
        }

        // Calculer le montant total des paiements
        const montantTotalPaiements = paiements.reduce((total, paiement) => total + paiement.montant, 0);

        // Récupérer toutes les avances pour ce projet
        const avances = await Avance.find({ projetId: projectId });
        console.log('Avances récupérées:', avances); // Ajout d'un console.log pour vérifier les avances récupérées
        const totalAvances = avances.reduce((total, avance) => total + avance.avance, 0);

        // Calculer le reste à payer
        const resteAPayer = montantTotalPaiements - totalAvances;

        res.status(200).json({
            projectId: projectId,
            montantTotalPaiements: montantTotalPaiements,
            totalAvances: totalAvances,
            resteAPayer: resteAPayer,
        });
    } catch (error) {
        console.error("Erreur lors du calcul du reste à payer :", error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};





module.exports = {
    AddPaiement,
    FindAll,
    FindOne,
    UpdateOne,
    DeleteOne,
    getPaiementsByProjectId,
    calculerResteAPayer,
};
