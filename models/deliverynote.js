const mongoose = require('mongoose');
const project = require('./project');
const DeliverynoteSchema = new mongoose.Schema(
    {
        project_name: {
            type: String
        },
        project: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project', 
            required: true 
        },
        number: {
            type: String
        },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user', 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        person: [{
            name: {
                type: String,
                requiered: false
            }
        }],
        materials: [{
            name: { 
                type: String, 
                required: false 
            }
        }],
        hours: [{
            type: Number
        }]
    }
)

DeliverynoteSchema.index({project: 1, number: 1}, {unique: true})


module.exports = mongoose.model("deliverynote", DeliverynoteSchema);