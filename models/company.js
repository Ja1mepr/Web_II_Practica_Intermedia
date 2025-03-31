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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("company", CompanySchema)