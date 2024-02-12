const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default:'General'
    },
    date:{
        type: Date,
        required: Date.now
    }
})

const notes = mongoose.model('notes',NotesSchema);
notes.createIndexes();
module.exports = notes;