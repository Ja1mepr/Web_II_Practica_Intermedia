const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema(
    {
     name: {
        type: String,
        required: true
     },
     description: {
        type: String
     },
     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
     },
     client_associated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: false
     }
    }
);

//Index compuesto que permite que la clave sea unica solo para los proyectos creados por el mismo creador
ProjectSchema.index({createdBy: 1, name: 1}, {unique: true})

module.exports = mongoose.model("project", ProjectSchema)