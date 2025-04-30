const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String
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

ClientSchema.index({createdBy: 1, email: 1}, {unique: true})

module.exports = mongoose.model("client", ClientSchema)