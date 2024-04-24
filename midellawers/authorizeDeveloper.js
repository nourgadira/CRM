// authorizeDeveloper.js

const authorizeDeveloper = (req, res, next) => {
    try {
        // Vérifiez si l'utilisateur est connecté et que le rôle est correct (par exemple, 1 pour développeur)
        if (req.user && req.user.role === 1) {
            // Si le rôle est correct, passez à l'étape suivante
            next();
        } else {
            // Si le rôle n'est pas correct ou si l'utilisateur n'est pas connecté, renvoyez une erreur 403
            throw new Error('Forbidden');
        }
    } catch (error) {
        // Gérez l'erreur en renvoyant une réponse JSON avec le statut 403 et un message d'erreur
        res.status(403).json({ message: error.message });
    }
};

module.exports = authorizeDeveloper;
