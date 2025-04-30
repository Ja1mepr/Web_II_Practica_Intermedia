const DeliverynoteModel = require('../models/deliverynote')
const ProjectModel = require('../models/project')
const UserModel = require('../models/users')
const {matchedData} = require('express-validator')

const getItem = async (req, res) => {
    try{
        const deliverynote_id = req.params.id
        const deliverynote = await DeliverynoteModel.findById(deliverynote_id)
        res.status(200).json(deliverynote)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTE")
    }
}

const getItems = async (req, res) => {
    try{
        const associated = req.user
        deliverynotes = await DeliverynoteModel.find({createdBy: associated._id})
        res.status(200).json(deliverynotes)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_DELIVERYNOTES")
    }
} 

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const project = await ProjectModel.findOne({name: data.project_name})
        console.log(project)
        const body = {...data, project_name: data.project_name,
            project: project._id, createdBy: user._id, data}
        const client = await DeliverynoteModel.create(body)
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_DELIVERYNOTE")
    }
}


module.exports = {getItem, getItems, createItem}