const { response } = require('express');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send("user not found");
        }

        console.log(user);

        // Vérifiez si l'utilisateur est désactivé avant de procéder à la connexion
        if (user.active === 'false') {
            return res.status(400).send("user desactived");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("invalid password");
        }

        const token = jwt.sign({ id: user._id, role: user.role, image: user.image }, process.env.JWT_SECRET);
        return res.status(200).send({ token: token, id: user._id });
    } catch (error) {
        console.log(error);
        return res.status(500).send("error authenticating");
    }
};

module.exports.authController = {
    Login
};
