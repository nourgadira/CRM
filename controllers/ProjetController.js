const Projet = require('../models/Projet');
const Client = require('../models/Client');
const Portfolio = require('../models/Portfolio');
const NotificationModel = require('../models/Notification');
const upload = require("../utils/uploadImage");
const Tache = require('../models/Tache');

const uploadFile = upload.single("file");
const projetController = {
    createProjet: async (req, res) => {
        try {
            if (!req.user || !req.user._id) {
                throw new Error('User not authenticated or missing _id');
            }

            // Logique de création du projet
            const newProjet = await Projet.create(req.body);

            // Logique de création du portfolio associé au projet
            const newPortfolio = await Portfolio.create({
                name: `Portfolio pour ${newProjet.nom}`,
                description: 'Description du portfolio',
                client: newProjet.clientId,
            });

            await NotificationModel.create({
                sender: req.user._id,
                receiver: req.body.chefProjet,
                message: JSON.stringify(newProjet)
            });

            res.status(201).json({ message: 'Projet et portfolio créés avec succès', projet: newProjet, portfolio: newPortfolio });
        } catch (error) {
            console.error('Error creating projet and portfolio:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },



    checkProjetFinished: async (req, res) => {
        try {
            const projetId = req.params.id;

            // Récupérez toutes les tâches liées à ce projet
            const tasks = await Tache.find({ projet: projetId });
            console.log('tasks:', tasks)
            // Vérifiez si toutes les tâches sont dans l'état "done"
            const allTasksDone = tasks.every(task => task.etat === 'done');
            console.log('all tasks done:', allTasksDone)

            // Mettez à jour l'état du projet en conséquence
            const updatedProjet = await Projet.findByIdAndUpdate(projetId, { etat: allTasksDone ? 'fini' : 'en cours' }, { new: true });

            res.status(200).send({ message: 'Projet state updated', projet: updatedProjet });
        } catch (error) {
            console.error('Error checking projet finished:', error);
            res.status(500).send({ message: 'Error checking projet finished', error: error.message });
        }
    },
    getProjets: async (req, res) => {
        const name = req.query.name;
        try {
            const projets = name ? await Projet.find({ status: 0, nom: name }).populate('clientId').populate('chefProjet') : await Projet.find({ status: 0 }).populate('clientId').populate('chefProjet').populate('taskId'); // Ensure 'tasks' is the correct field name

            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets:', error);
            res.status(500).send({ message: 'Error getting projets', error: error.message });
        }
    },
    getProjetsByPaymentStatus: async (req, res) => {
        const isPaid = req.query.isPaid === 'true'; // Convert the query parameter to a boolean
        try {
            const projets = await Projet.find({ paymentStatus: isPaid }).populate('clientId').populate('chefProjet');
            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets by payment status:', error);
            res.status(500).send({ message: 'Error getting projets by payment status', error: error.message });
        }
    },
    getProjetsArchive: async (req, res) => {
        const name = req.query.name;
        try {
            const projets = name ? await Projet.find({ status: 1, nom: name }).populate('clientId').populate('chefProjet') : await Projet.find({ status: 1 }).populate('clientId').populate('chefProjet');
            res.status(200).send({ projets });
        } catch (error) {
            console.error('Error getting projets:', error);
            res.status(500).send({ message: 'Error getting projets', error: error.message });
        }
    },

    getProjectsByClientId: async (req, res) => {
        try {
            const clientId = req.params.clientId;
            const projects = await Projet.find({ clientId }).populate('clientId').populate('chefProjet'); // Assurez-vous que 'clientId' correspond au nom du champ dans votre modèle Projet
            res.json({ projects });
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: 'Error fetching projects' });
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


            if (!deletedProjet) {
                return res.status(404).send({ message: 'Projet not found' });
            }

            res.status(200).send({ message: 'Projet successfully deleted', projet: deletedProjet });
        } catch (error) {
            console.error('Error deleting projet:', error);
            res.status(500).send({ message: 'Error deleting projet', error: error.message });
        }
    },
    upload: async (req, res) => {
        try {
            uploadFile(req, res, async function (err) {

                console.log(req)

                const image = {
                    file: "http://localhost:8080/uploads/" + req.file.filename,
                };
                await Projet.findOneAndUpdate({ _id: req.query.id }, { file: image.file }, { new: true });
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
