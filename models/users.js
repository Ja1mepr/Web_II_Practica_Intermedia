const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete')
const UserSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'company',
            required: false
        },
        name: {
            type: String
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        code: {
            type: String
        },
        nif: {
            type: String,
            unique: true,
            sparse: true //Permite valores nulos duplicados
        },
        address: {
            type: String
        },
        role: {
            type: String,
            enum: ["user", "admin", "guest"],
            default: "user"
        },
        status: {
            type: String,
            enum: ["pending", "validated"],
            default: "pending"
        },
        deletedAt: {
            type: Date, 
            default: null
        },
        autonomous: {
            type: Boolean
        },
        clients: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'client'
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model("users", UserSchema);