const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  role:String 
});

const user = new User({
  username: 'nour',
  email: 'nourrr@example.com',
  password: 'mot_de_passe_securise',
  role:'admin'

});

user.save()
  .then(() => {
    console.log('Utilisateur inséré avec succès.');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Erreur lors de l\'insertion de l\'utilisateur:', error);
    mongoose.connection.close();
  });
