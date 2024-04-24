const Projet = require('../models/Projet');
const Client = require('../models/Client');
const Portfolio = require('../models/Portfolio');
const Tache = require('../models/Tache');
const upload = require("../utils/upload");
const uploadFile = upload.single("file");
const projetController = {
    createProjet: async (req, res) => {
        try {
            // Logique de création du projet
            const newProjet = await Projet.create(req.body);

            // Logique de création du portfolio associé au projet
            const newPortfolio = await Portfolio.create({
                name: `Portfolio pour ${newProjet.nom}`,
                description: 'Description du portfolio',
                projetId: newProjet._id,
            });

            res.status(201).json({ message: 'Projet et portfolio créés avec succès', projet: newProjet, portfolio: newPortfolio });
        } catch (error) {
            console.error('Error creating projet and portfolio:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getProjets: async (req, res) => {
        const name = req.query.name;
        try {
            const projets = name ? await Projet.find({status: 0, nom: name}).populate('clientId'): await Projet.find({status: 0}).populate('clientId');
            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets:', error);
            res.status(500).send({ message: 'Error getting projets', error: error.message });
        }
    },
    
    getProjetsArchive: async (req, res) => {
        const name = req.query.name;
        try {
            const projets = name ? await Projet.find({status: 1, nom: name}).populate('clientId'): await Projet.find({status: 1}).populate('clientId');
            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets:', error);
            res.status(500).send({ message: 'Error getting projets', error: error.message });
        }
    },
    
    getProjetsByIdClient: async (req, res) => {
        const clientId = req.query.clientId;
        try {
            const projets = await Projet.find({clientId: clientId});
            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets:', error);
            res.status(500).send({ message: 'Error getting projets', error: error.message });
        }
    },

    getProjetById: async (req, res) => {
        try {
            const projet = await Projet.findById(req.params.id);
            if (!projet) {
                return res.status(404).send({ message: 'Projet not found' });
            }
            res.status(200).send({ projet });
        } catch (error) {
            console.error('Error getting projet by ID:', error);
            res.status(500).send({ message: 'Error getting projet by ID', error: error.message });
        }
    },

    updateProjet: async (req, res) => {
        try {
            const updatedProjet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!updatedProjet) {
                return res.status(404).send({ message: 'Projet not found' });
            }

            res.status(200).send({ message: 'Projet successfully updated', projet: updatedProjet });
        } catch (error) {
            console.error('Error updating projet:', error);
            res.status(500).send({ message: 'Error updating projet', error: error.message });
        }
    },

    deleteProjet: async (req, res) => {
        try {
            const deletedProjet = await Projet.findByIdAndUpdate(req.params.id, { status: req.params.status });

            // const deletedProjet = await Projet.findByIdAndDelete(req.params.id);

            if (!deletedProjet) {
                return res.status(404).send({ message: 'Projet not found' });
            }

            res.status(200).send({ message: 'Projet successfully deleted', projet: deletedProjet });
        } catch (error) {
            console.error('Error deleting projet:', error);
            res.status(500).send({ message: 'Error deleting projet', error: error.message });
        }
    },
    upload : async (req, res)=>{
        try {
            uploadFile(req, res, async function (err) {
         
                console.log(req)
                
                  const image = {
                    file: "http://localhost:8080/uploads/" + req.file.filename,
                  };
                  await Projet.findOneAndUpdate({_id: req.query.id}, { file: image.file}, { new: true });
                  res.send("success")
                
              
            });
          } catch (error) {
            res.status(500).json({ message: err.message });
          }
    }
};

async function getClientById(clientId) {
    return await Client.findById(clientId);
}

async function updateOrCreatePortfolio(client, projet) {
    const existingPortfolio = await Portfolio.findOne({ client: client._id });

    let newPortfolio;

    if (existingPortfolio) {
        newPortfolio = existingPortfolio;
        newPortfolio.projects.push(projet._id);
    } else {
        newPortfolio = new Portfolio({
            name: `Portfolio pour ${client.nom}`,
            description: `Description pour ${client.nom}`,
            creationDate: new Date(),
            endDate: null,
            client: client._id,
            projects: [projet._id],
        });
    }

    await newPortfolio.save();

    return newPortfolio;
}




module.exports = projetController;
