const { matchedData } = require("express-validator")
const ProjectModel = require("../models/project")
const ClientModel = require("../models/client")

const getItem = async (req, res) => {
    try{
        const project_id = req.params.id
        const user = req.user
        const client = await ProjectModel.findOne({_id: project_id, createdBy: user._id})
        if(client==null){
            res.status(404).json('ITEM_NOT_FOUND')
            return
        }
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
        const createdBy = req.user._id
        client_associated = await ClientModel.findOne({email: data.client_email}) 
        const project = {...data, createdBy: createdBy, client_associated: client_associated._id}
        const projectData = await ProjectModel.create(project)
        const updated_client = await ClientModel.findOneAndUpdate({email: data.client_email}, 
            {$addToSet: { projects: projectData._id}}, {new: true}
        )
        if(updated_client==null){
            res.status(404).send('CLIENT_DOESNT_EXIST')
        }
        res.status(201).json(projectData)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_PROJECT")
    }
}

const updateItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const item = await ProjectModel.findOneAndUpdate({_id: req.params.id, createdBy: user._id}, data)
        if(item==null){
            res.status(404).send('ITEM_NOT_FOUND')
            return
        }
        res.status(200).json('ITEM_UPDATED')
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_UPDATING_PROJECT")
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const deleted = await ProjectModel.findOneAndDelete({name: data.name, createdBy: user._id})
        if(deleted==null){
            res.status(404).json('ITEM_NOT_FOUND')
            return 
        }
        res.status(200).json({message: "Proyecto eliminado(hard delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_PROJECT")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const project = await ProjectModel.findOne({projectCode: data.projectCode, createdBy: user._id})
        if(project==null){
            res.status(404).json('ITEM_NOT_FOUND')
            return
        }
        project.deleted = true
        project.deletedAt = new Date()
        await project.save()
        res.status(200).json({message: "Proyecto eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_PROJECT")
    }
}

const deleteItem = async (req, res) => {
    if(req.query.soft!='false')
        softDeleteItem(req, res)
    else
        hardDeleteItem(req, res)
}

const getArchivedItems = async (req, res) => {
    try{
        const user = req.user
        const archived = await ProjectModel.findDeleted({createdBy: user._id})
        if(archived==null){
            res.status(404).json('ITEM_NOT_FOUND')    
            return
        }
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_PROJECT")
    }
}


const recoverArchivedItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const archived = await ProjectModel.findOneDeleted({projectCode: data.projectCode, createdBy: user._id})
        if(archived==null){
            res.status(404).json('ITEM_NOT_FOUND') 
            return 
        }
        await archived.restore()
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_PROJECT")
    }
}


module.exports = {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem}