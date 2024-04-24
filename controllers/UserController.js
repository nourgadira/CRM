const mongoose = require('mongoose');
const User = require('../models/User'); // Assurez-vous que le chemin est correct
const nodemailer = require('nodemailer');

class UserController {
  async store(req, res) {
    try {
      const { name, email, role, salairefixe, prime, password } = req.body; // Assurez-vous que ces champs sont présents dans req.body
      // Créer un nouvel utilisateur
      const newUser = new User({ name, email, role, salairefixe, prime, password });
      await newUser.save();

      // Configurer le transporter Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: "isetkr9@gmail.com",
          pass: "rmzw hxeo qiug bblz",


        },
      });

      // Envoyer un e-mail de bienvenue à l'utilisateur
      const info = await transporter.sendMail({
        from: "isetkr9@gmail.com",
        to: email,
        subject: "Nouveau compte créé",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px;">
              <h1 style="text-align: center; font-size: 30px; margin-bottom: 20px; font-weight: 600; color: #333333;">
                Bienvenue sur notre site
              </h1>
              <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
                Cher ${name},
              </p>
              <p style="font-size: 20px; margin-bottom: 20px; color: #333333;">
                Votre nouveau compte a bien été créé. Voici vos informations de connexion :
              </p>
              <ul style="list-style-type: none; padding-left: 0;">
               
                <li><strong>Mot de passe:</strong> ${password}</li>
                <li><strong>Nom:</strong> ${name}</li>
                <li><strong>Salaire Fixe:</strong> ${salairefixe}</li>
                <li><strong>Prime:</strong> ${prime}</li>
                </ul>
              <p style="font-size: 12px; color: #fff; font-weight: bold;">
                Merci et bienvenue !
              </p>
            </div>
          </div>
        `,
      });

      // Réponse JSON indiquant que l'utilisateur a été créé avec succès
      return res.status(201).json({
        success: true,
        message: "Utilisateur ajouté avec succès",
        data: newUser,
      });
    } catch (error) {
      // En cas d'erreur, renvoyer une réponse avec le détail de l'erreur
      return res.status(400).json({ error: 'Impossible de créer l\'utilisateur', details: error.message });
    }
  }

    async  upload (req, res){
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



  async updateUserArchive(req, res) {
    const userId = req.params.id;

    try {
      // Chercher l'utilisateur par son ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // Inverser la valeur du champ "archive"
      user.archive = !user.archive;

      // Sauvegarder les modifications dans la base de données
      await user.save();

      res.status(200).json({ message: "Champ archive mis à jour avec succès.", user });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du champ archive :", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du champ archive." });
    }
  };

  async getAllUsers(req, res) {
    try {
      const users = await User.find({etat: req.params.etat});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch Users', details: error.message });
    }
  }
  async updateRating(req, res) {
    try {
      const { userId, newRating } = req.params;

      // Vérifier si l'ID de l'utilisateur est valide
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format' });
      }

      // Vérifier si le rating est un nombre valide
      if (isNaN(newRating)) {
        return res.status(400).json({ error: 'Invalid Rating format' });
      }

      // Convertir le rating en nombre entier
      const rating = parseInt(newRating);

      // Mettre à jour le rating de l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(userId, { rating }, { new: true });

      // Vérifier si l'utilisateur existe
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Répondre avec l'utilisateur mis à jour
      res.status(200).json(updatedUser);
    } catch (error) {
      // Gérer les erreurs
      res.status(500).json({ error: 'Unable to update User Rating', details: error.message });
    }
  }
  async getLoggedInUser(req, res) {
    try {
      // Récupérez les informations de l'utilisateur depuis req.user
      const user = req.user;
  
      // Assurez-vous que l'utilisateur est défini avant d'accéder à ses propriétés
      if (user && user.name) {
        res.json({ name: user.name });
      } else {
        // Si l'utilisateur n'est pas défini ou s'il n'a pas de nom, renvoyez une erreur
        res.status(401).json({ message: 'Utilisateur non connecté ou nom d\'utilisateur non disponible.' });
      }
    } catch (error) {
      // En cas d'erreur, renvoyez une erreur avec le détail de l'erreur
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur connecté', details: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await User.find({_id : req.params.id});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch User', details: error.message });
    }
  }
 

  async updateUserById(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No valid data provided for update' });
      }

      const userId = req.params.id.trim();

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format' });
      }

      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed')) {
        return res.status(400).json({ error: 'Invalid User ID format' });
      }

      res.status(400).json({ error: 'Unable to update User', details: error.message });
    }
  }

  async deleteUserById(req, res) {
    try {
      const deletedUser = await User.findByIdAndUpdate(req.params.id, { etat: req.params.etat });
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete User', details: error.message });
    }
  }

  async getDeveloppeurs(req, res) {
    try {
      const developpeurs = await User.find({ role: '1' });
      res.json({ developpeurs });
    } catch (error) {
      console.error('Error fetching developpeurs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async restoreEmployee(req, res) {
    try {
      const { id } = req.params;

      // Recherchez l'employé à restaurer dans la base de données
      const employee = await User.findByIdAndUpdate(id, { archived: false }, { new: true });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(employee); // Réponse avec l'employé restauré
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  async getArchivedUsers(req, res) {
    try {
      const archivedUsers = await User.find({ archive: true });
      res.status(200).json(archivedUsers);
    } catch (error) {
      console.error('Error fetching archived users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async destroyEmployee(req, res) {
    const { id } = req.params;

    try {
      // Find the archived employee by ID and remove the archived status
      const user = await User.findByIdAndUpdate(id, { isArchived: false });

      if (!user) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.status(200).json({ message: 'Employee destroyed and restored successfully' });
    } catch (error) {
      console.error('Error destroying employee:', error);
      res.status(500).json({ error: 'Error destroying employee' });
    }
  };

  async updateUserState(req, res) {
    const { userId } = req.params;
    const { archive } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      user.archive = archive;
      await user.save();

      return res.status(200).json({ message: 'État de l\'utilisateur mis à jour avec succès.' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état de l\'utilisateur.', error: error.message });
    }
  };
  async getAllUsersExceptDevelopers(req, res) {
    try {
      const users = await User.find();
      const filteredUsers = users.filter(user => user.role !== 'developpeur');
      res.json(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 
  
}

module.exports = new UserController();
