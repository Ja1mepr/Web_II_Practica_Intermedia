const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete')
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
            ref: 'user',
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
ClientSchema.plugin(mongooseDelete, {overrideMethods: 'all'})


module.exports = mongoose.model("client", ClientSchema)