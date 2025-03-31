const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const {encrypt, compare} = require('../utils/handlePassword')
const {tokenSign} = require('../utils/handleTokenJWT')
const crypto = require('crypto')

const getItem = async (req, res) => {
    try{
        res.status(200).json(req.user)
    }catch(err){
        console.log(err)
        res.status(403).json(err)
    }
}

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        //Encriptamos la constraseña
        const password = await encrypt(data.password)
        const code = crypto.randomInt(100000, 999999).toString()
        //Creamos un nuevo objeto modificando la contraseña por la encriptada
        const body = {...data, password, code} //Si password no es un campo del objeto lo añade,  si no lo sobreescribe
        const user = await UserModel.create(body) 
        //Oculta la contraseña en la respuesta
        user.set('password', undefined, {strict: false})
        //Añadimos el token firmado al objeto
        const userData = {
            token: await tokenSign(user),
            user: user
        }
        console.log('Recurso creado\nCode:'+code)
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
            res.status(400).send('ERROR_INVALID_CODE')
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
            res.status(400).send('ERROR_USER_DONT_EXISTS')
            return
        }
        const check = await compare(data.password, user.password)
        if(!check){
            res.status(400).send('ERROR_INVALID_PASSWORD')
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

const onBoarding = async (req, res) => {
    try{
        data = matchedData(req)
        console.log(data)
        console.log(req.user)
        const user = await UserModel.findOneAndUpdate({email: req.user.email}, {name: data.name}, {lastName: data.lastName}, {nif: data.nif})
        res.status(200).json(user)
    }catch(err){
        console.log(err)
        res.status(403).send('ERROR_ON_BOARDING_USER')
    }
}

const hardDeleteItem = async (req, res) => {
    try{
        await UserModel.findOneAndDelete({email: req.user.email})
        console.log(`El usuario ${req.user.name} ha sido eliminado`)
        res.status(200).json({message: "usuario eliminado(hard delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_USER")
    }
}

const softDeleteItem = async (req, res) => {
    try{
        await UserModel.findOneAndUpdate({email: req.user.email}, {deletedAt: new Date()})
        res.status(200).json({message: "usuario eliminado(soft delete)"})
    }catch(err){
        console.log(err)
        res.status(403).send("ERROR_DELETING_USER")
    }
}

module.exports = {getItem, createItem, userLogin, validateUser, onBoarding, hardDeleteItem, softDeleteItem}