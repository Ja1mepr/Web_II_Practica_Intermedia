const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        cif: {
            type: String,
            unique: true
        },
        address: {
            type: String
        },
        employees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("company", CompanySchema)