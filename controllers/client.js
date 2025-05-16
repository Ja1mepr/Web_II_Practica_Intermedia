const ClientModel = require('../models/client')
const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const { encrypt } = require('../utils/handlePassword')

const getItem = async (req, res) => {
    try{
        const user = req.user
        const client_id = req.params.id
        const client = await ClientModel.findOne({_id: client_id, createdBy: user._id})
        if(client==null){
            res.status(404).json('ERROR_CLIENT_NOT_FOUND')
            return
        }
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_CLIENT")
    }
}

const getItems = async (req, res) => {
    try{
        const user = req.user
        clients = await ClientModel.find({createdBy: user._id})
        res.status(200).json(clients)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_CLIENTS")
    }
} 

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        createdBy = req.user._id
        company = req.user.company
        const password = await encrypt(data.password)
        const body = {...data, createdBy, company, password}
        const client = await ClientModel.create(body)
        client.set('password', undefined, {strict: false})
        const user = await UserModel.findByIdAndUpdate(createdBy, {$addToSet: {clients: client._id}}, {new: true})
        res.status(201).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_CLIENTS")
    }
}

const updateItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const clientData = await ClientModel.findOneAndUpdate({email: data.email, createdBy: user._id}, data, {new: true})
        if(clientData==null)
            return res.status(404).json('ITEM_NOT_FOUND')
        res.status(200).json(clientData)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_UPDATING_CLIENT")
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const deleted = await ClientModel.findOneAndDelete({email: data.email, createdBy: user._id})
        if(deleted==null){
            res.status(404).send(`CLIENT_NOT_FOUND`)
            return
        }
        res.status(200).json({message: "Cliente eliminado(hard delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_CLIENT")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const client = await ClientModel.findOne({email: data.email, createdBy: user._id})
        if(client==null){
            res.status(404).send(`CLIENT_NOT_FOUND`)    
            return 
        }
        client.deleted = true
        client.deletedAt = new Date()
        const deleted = await client.save()
        res.status(200).json({message: "Cliente eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_CLIENT")
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
        const archived = await ClientModel.findDeleted({createdBy: user._id})
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_CLIENT")
    }
}


const recoverArchivedItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const archived = await ClientModel.findOneDeleted({email: data.email, createdBy: user._id})
        if(archived==null){
            res.status(404).json('NO_ITEM_TO_RECOVER')
            return
        }
        await archived.restore()
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_CLIENT")
    }
}


module.exports = {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem}