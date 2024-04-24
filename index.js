const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('./models/User');
const Projet = require('./models/Projet');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projetRoutes = require('./routes/ProjetRoutes');
const PotflioRoutes = require('./routes/PotflioRoutes');
const ClientRoutes = require('./routes/ClientRoutes');
const TacheRoutes = require('./routes/TacheRoutes');
const loggerCustom = require('./customLogger');
const logger = require('./logger');
const RendezvousRoutes=require('./routes/RendezvousRoutes')
const notificationRoutes = require('./routes/notificationRoutes');
const rendezVous = require('./models/rendezVous');
const app = express();
const port = 8080;
app.use('/uploads', express.static('public/uploads'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

mongoose.connect('mongodb://localhost:27017/login')
  .then(() => {
    logger.info('Connected to the database');
  })
  .catch((error) => {
    logger.error('Error connecting to the database:', error);
  });


  logger.info('Message d\'information');
  logger.error('Erreur rencontrée');
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
app.post('/notifications/send', async (req, res) => {
    try {
      const { message, recipientId, tachesIds } = req.body;
  
      // Code pour envoyer la notification à l'aide d'une API externe ou de votre propre système de notification
      // Ici, nous utilisons axios pour effectuer une requête POST fictive à une API de notification
      const notificationRes = await axios.post('https://exemple-api-notifications.com/send', {
        message,
        recipientId,
        tachesIds,
      });
  
      console.log('Réponse de l\'envoi de la notification:', notificationRes.data);
  
      res.status(200).json({ success: true, message: 'Notification envoyée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification :', error);
      res.status(500).json({ success: false, error: 'Erreur lors de l\'envoi de la notification.' });
    }
  });
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Home page');
});



app.post('/api/projets', async (req, res) => {
    try {
        const { nom, description, dateDebut, dateFin, coutProjet, dateRenouvellement, dateHebergement, coutMaitenance, clientId, tachesIds } = req.body;
  
        const nouveauProjet = new Projet({
            nom,
            description,
            dateDebut,
            dateFin,
            coutProjet,
            dateRenouvellement,
            dateHebergement,
            coutMaitenance,
            clientId,
            taches: tachesIds,
        });
  
        const projetCree = await nouveauProjet.save();
  
        res.status(201).json({ message: 'Projet créé avec succès', projet: projetCree });
    } catch (error) {
        console.error('Erreur lors de la création du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/', userRoutes);
app.use('/api/', projetRoutes);
app.use('/api', ClientRoutes); // Utilisation des routes définies dans ClientRoutes.js
app.use('/api/', PotflioRoutes);
app.use('/api', TacheRoutes);
app.use('/api', RendezvousRoutes);

app.get('/api/voirPortfolio/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    res.json({ clientId });
});
app.use('/api', notificationRoutes);

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find().populate('projetsIds'); // Assurez-vous que 'projetsIds' est le nom du champ qui contient les IDs des projets pour chaque client
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});


app.get('/api/clients/top', async (req, res) => {
  try {
    // Utilisation de MongoDB avec Mongoose pour effectuer la requête
    const clients = await Client.aggregate([
      {
        $lookup: {
          from: 'projects', // Nom de la collection des projets
          localField: '_id',
          foreignField: 'clientId',
          as: 'projects',
        },
      },
      {
        $match: {
          'projects.5': { $exists: true }, // Vérifie s'il y a au moins 6 projets (indice 0 à 5)
        },
      },
    ]);

    res.json(clients);
  } catch (error) {
    console.error('Error fetching top clients:', error);
    res.status(500).json({ message: 'Error fetching top clients' });
  }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {
    upload: upload
};
