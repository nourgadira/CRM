const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projetRoutes = require('./routes/ProjetRoutes');
const ClientRoutes = require('./routes/ClientRoutes');
const TacheRoutes = require('./routes/TacheRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const RendezvousRoutes = require('./routes/RendezvousRoutes');
const PaiementRoutes = require('./routes/PaiementRoutes');
const AvanceRoutes = require('./routes/AvanceRoutes');
const NoteRoutes = require('./routes/NotesRoutes');
const BudgetRoutes = require('./routes/BudgetRoutes');
const VacationsRoutes = require('./routes/vacationRoutes');
const RisquesRoutes = require('./routes/RisquesRoutes');


const passport = require('passport');
const app = express();
const port = 8080;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:59090'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
};

app.use(cors(corsOptions)); // Utilisation unique de CORS ici

app.use('/uploads', express.static('public/uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));


/* passport */
require('./security/passport')(passport);

// Définition des routes
app.use('/api', [NoteRoutes, RisquesRoutes, VacationsRoutes, BudgetRoutes, authRoutes, AvanceRoutes, userRoutes, PaiementRoutes, ClientRoutes, projetRoutes, TacheRoutes, RendezvousRoutes, notificationRoutes]);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/login`);
});
