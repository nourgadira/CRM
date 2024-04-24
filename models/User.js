const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Number, required: true },
    salairefixe: { type: Number, required: true },
    prime: { type: Number, required: true },
    archive: { type: Boolean, default: false },
    etat: { type: String, enum: ['active', 'inactive'], default: 'active' },
    image: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
