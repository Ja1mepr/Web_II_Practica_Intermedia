const ClientModel = require('../models/client')
const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const { encrypt } = require('../utils/handlePassword')

const getItem = async (req, res) => {
    try{
        const client_id = req.params.id
        const client = await ClientModel.findById(client_id)
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_CLIENT")
    }
}

const getItems = async (req, res) => {
    try{
        const associated = req.user
        clients = await ClientModel.find({createdBy: associated._id})
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
        res.status(200).json(client)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_CLIENTS")
    }
}

const updateItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const clientData = await ClientModel.findOneAndUpdate({email: data.email}, data, {new: true})
        res.status(200).json(clientData)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_UPDATING_CLIENT")
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const deleted = await ClientModel.findOneAndDelete({email: data.email})
        if(deleted)
            res.status(200).json({message: "Cliente eliminado(hard delete)"})
        else
            res.status(403).send(`Client with key ${data.email} does not exist`)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_CLIENT")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const updated = await ClientModel.findOneAndUpdate({email: data.email}, {deletedAt: new Date()}, {new: true})
        res.status(200).json({message: "Cliente eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_CLIENT")
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
        const archived = await ClientModel.find({deletedAt: { $exists: true, $ne: null}})
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_CLIENT")
    }
}


const recoverArchivedItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const archived = await ClientModel.findOneAndUpdate({email: data.email}, {deletedAt: null}, {new: true})
        res.status(200).json(archived)
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_GETTING_ARCHIVED_CLIENT")
    }
}


module.exports = {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem}