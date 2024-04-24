const multer = require('multer');

// Configuration de multer pour gérer les téléversements de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Le dossier où enregistrer les fichiers téléchargés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Le nom du fichier téléchargé
    }
});

// Initialisez multer avec le stockage
const upload = multer({ storage: storage });

// Exportez la variable upload pour l'utiliser dans d'autres fichiers
module.exports = {
    upload: upload
};
