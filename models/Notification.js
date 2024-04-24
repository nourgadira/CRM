const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  idDeveloppeur: { type: Schema.Types.ObjectId, ref: 'User' },
   taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true }, // Ajout du champ taskId
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
