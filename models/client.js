const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema(
    {
     name: {
        type: String
     },
     email: {
        type: String,
        unique: true
     },
     password: {
        type: String
     },
     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
     },
     deletedAt: { 
        type: Date, 
        default: null
    },
     company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: false
     },
     projects: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'project'
    }]
    }
);

module.exports = mongoose.model("client", ClientSchema)