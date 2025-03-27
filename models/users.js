const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String // Falta guardar el hash
        },
        code: {
            type: String,
            required: false
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("users", UserSchema);