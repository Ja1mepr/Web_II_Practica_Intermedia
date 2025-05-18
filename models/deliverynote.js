const mongoose = require('mongoose');
const DeliverynoteSchema = new mongoose.Schema(
    {
        project_name: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        project: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project',
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        people: [{
            name: {
                type: String,
                requiered: false
            },
            rol: {
                type: String
            },
            hours: {
                type: String
            }
        }],
        materials: [{
            name: { 
                type: String, 
                required: false 
            },
            units: {
                type: String
            }
        }],
        signed: {
            type: Boolean,
        },
        signature: {
            type: String
        },
        pinata_CID:{
            deliverynote: {
                type: String,
                default: null
            },
            deliverynotePDF: {
                type: String,
                default: null
            }
        }
    }
)

DeliverynoteSchema.index({project: 1, number: 1}, {unique: true})


module.exports = mongoose.model("deliverynote", DeliverynoteSchema);