const mongoose = require('mongoose');
const AlbaranesSchema = new mongoose.Schema(
    {
        number: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project',
        }
    }
)

module.exports = mongoose.model("albaranes", AlbaranesSchema);