const UserModel = require('../models/users')
const CompanyModel = require('../models/company')
const {matchedData} = require('express-validator')
const {encrypt, compare} = require('../utils/handlePassword')
const {tokenSign} = require('../utils/handleTokenJWT')
const crypto = require('crypto')

const getItem = async (req, res) => {
    try{
        res.status(200).json(req.user)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_GETTING_ITEM")
    }
}

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        //Encriptamos la constraseña
        const password = await encrypt(data.password)
        const code = crypto.randomInt(100000, 999999).toString()
        const autonomous = false
        //Creamos un nuevo objeto modificando la contraseña por la encriptada
        const body = {...data, password, code, autonomous} //Si password no es un campo del objeto lo añade,  si no lo sobreescribe
        console.log("A")
        const user = await UserModel.create(body) 
        //Oculta la contraseña en la respuesta
        user.set('password', undefined, {strict: false})
        //Añadimos el token firmado al objeto
        const userData = {
            token: await tokenSign(user),
            user: user
        }
        console.log('Recurso creado\nCode: '+code)
        res.status(201).json(userData)
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_CREATING_ITEM")
    }
}

const validateUser = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        if(data.code!=user.code){
            res.status(403).send('ERROR_INVALID_CODE')
            return
        }
        console.log(data.code+"---"+user.code)
        // Actualizamos el campo estatus para validarlo
        await UserModel.findOneAndUpdate({email: data.email}, {status: 'validated'})
        
        res.json({message: "ACK"})
    }catch(err){
        console.log(err)
        res.status(403).json("ERROR_VALIDATING_USER")
    }
}

const userLogin = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = await UserModel.findOne({email: data.email})
        if(!user){
            res.status(404).send('ERROR_USER_DONT_EXISTS')
            return
        }
        const check = await compare(data.password, user.password)
        if(!check){
            res.status(401).send('ERROR_INVALID_PASSWORD')
            return
        }
        //Oculta la contraseña en la respuesta
        user.set('password', undefined, {strict: false})

        const userData = {
            token: await  tokenSign(user),
            user: user
        }
        res.set("Authorization", `Bearer ${userData.token}`)
        res.json(userData)

    }catch(err){
        console.log(err)
        res.status(403).send('ERROR_LOGIN_USER')
    }
}

const updateItem = async (req, res) => {
    try{
        const data = matchedData(req)
        const user = req.user
        const userData = await UserModel.findByIdAndUpdate(user._id, data, {new: true})
        res.status(200).json(userData)
    }catch(err){
        console.log(err)
        res.status(403).send('ERROR_ON_BOARDING_USER')
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        const deleted = await UserModel.findOneAndDelete({email: req.user.email})
        if(!deleted)
            res.status(404).json('USER_NOT_FOUND')
        console.log(`El usuario ${req.user.name} ha sido eliminado`)
        res.status(200).json({message: "Usuario eliminado(hard delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_USER")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        const deleted = await UserModel.findOneAndUpdate({email: req.user.email}, {deletedAt: new Date()})
        if(!deleted)
            res.status(404).json('USER_NOT_FOUND')
        res.status(200).json({message: "Usuario eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_USER")
    }
}

const deleteItem = async (req, res) => {
    if(req.query.soft=='false')
        hardDeleteItem(req, res)
    else
        softDeleteItem(req, res)
}

module.exports = {getItem, createItem, userLogin, validateUser, updateItem, deleteItem}