const { matchedData } = require("express-validator")
const ProjectModel = require("../models/project")
const ClientModel = require("../models/client")

const getItem = async (req, res) => {
    try{
        const project_id = req.params.id
        client = await ProjectModel.findById(project_id)
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_PROJECT")
    }
}

const getItems = async (req, res) => {
    try{
        const createdBy = req.user.id
        clients = await ProjectModel.find({createdBy: createdBy})
        res.status(200).json(clients)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_PROJECTS")
    }
} 

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        createdBy = req.user._id
        client_associated = await ClientModel.findOne({email: data.client_email}) 
        const project = {...data, createdBy: createdBy, client_associated: client_associated._id}
        const projectData = await ProjectModel.create(project)
        const update_client = await ClientModel.findOneAndUpdate({email: data.client_email}, 
            {$addToSet: { projects: projectData._id}}, {new: true}
        )
        res.status(200).json(projectData)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_PROJECT")
    }
}

const updateItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const exists = await ProjectModel.findOne({name: data.name})
        let updatedItem
        if(!exists){
            updatedItem = await ProjectModel.findByIdAndUpdate(req.params.id, data, {new: true})
            res.status(200).json(updatedItem)
        }else
            res.status(403).send('THE_NAME_IS_ALREADY_IN_USE')
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_UPDATING_PROJECT")
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const deleted = await ProjectModel.findOneAndDelete({email: data.email})
        if(deleted)
            res.status(200).json({message: "Proyecto eliminado(hard delete)"})
        else
            res.status(403).send(`Project with key ${data.email} does not exist`)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_PROJECT")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const updated = await ProjectModel.findOneAndUpdate({email: data.email}, {deletedAt: new Date()}, {new: true})
        res.status(200).json({message: "Proyecto eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_PROJECT")
    }
}

const deleteItem = async (req, res) => {
    if(req.query.soft=='false')
        hardDeleteItem(req, res)
    else
        softDeleteItem(req, res)
}

const getArchivedItems = async (req, res) => {
    try{
        const archived = await ProjectModel.find({deletedAt: { $exists: true, $ne: null}})
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_PROJECT")
    }
}


const recoverArchivedItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const archived = await ProjectModel.findOneAndUpdate({email: data.email}, {deletedAt: null}, {new: true})
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_PROJECT")
    }
}


module.exports = {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem}