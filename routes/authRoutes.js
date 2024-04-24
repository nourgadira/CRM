const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const saltRounds = 10;

// Route pour l'inscription
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, salairefixe, prime } = req.body;

        // Vérifier si l'utilisateur existe déjà avec cet e-mail
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer un nouvel utilisateur
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            salairefixe,
            prime,
        });

        // Enregistrer le nouvel utilisateur
        await newUser.save();

        console.log('User successfully registered:', newUser.email);

        // Créer un token JWT pour l'authentification
        const token = jwt.sign({ userId: newUser._id }, 'votre_secret_key_secrete', { expiresIn: '1h' });

        res.status(200).json({
            message: 'User successfully registered',
            user: { name, email, role, _id },
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Attempting to log in with email:', email);

        // Vérifiez si l'email est valide
        if (!email || !email.includes('@') || !isValidEmail(email)) {
            console.error('Invalid email format:', email);
            return res.status(400).json({ message: 'Invalid email format' });
        }

      
        // Recherchez l'utilisateur par e-mail
        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found:', email);
            return res.status(401).json({ message: 'Invalid credentials', error: 'User not found' });
        }

        

        console.log('User successfully logged in:', user.email);

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, 'votre_secret_key_secrete', { expiresIn: '1h' });

        res.status(200).json({
            message: 'User successfully logged in',
            user: { name: user.name, email: user.email, role: user.role, userId: user._id },
            token,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message,
        });
    }
});



// Fonction pour vérifier si l'email est valide
function isValidEmail(email) {
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return false; // L'email doit avoir exactement une partie avant "@" et une après "@"
    }

    const domainParts = emailParts[1].split('.');
    if (domainParts.length < 2) {
        return false; // Le domaine doit avoir au moins un nom de domaine et une extension
    }

    return true;
}



module.exports = router;