const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },

    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tache',
        required: true,
    },
    read: {
        type: Boolean,
        default: false, // Par défaut, la note est marquée comme non lue
    },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
