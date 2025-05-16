const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete')
const ProjectSchema = new mongoose.Schema(
   {
      projectCode: {
         type: String,
         unique: true,
         required: true
      },
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
ProjectSchema.index({ createdBy: 1, name: 1 }, { unique: true })
ProjectSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model("project", ProjectSchema)