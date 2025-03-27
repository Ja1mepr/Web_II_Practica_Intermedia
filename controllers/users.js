const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const {encrypt, compare} = require('../utils/handlePassword')
const {tokenSign} = require('../utils/handleTokenJWT')

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        //Encriptamos la constraseña
        const password = await encrypt(data.password)

        //Creamos un nuevo objeto modificando la contraseña por la encriptada
        const body = {...data, password} //Si password no es un campo del objeto lo añade,  si no lo sobreescribe
        const user = await UserModel.create(body)
        //Oculta la contraseña en la respuesta
        user.set('password', undefined, {strict: false})
        //Añadimos el token firmado al objeto
        const userData = {
            token: await tokenSign(user),
            user: user
        }
        
        console.log('Recurso creado')
        res.status(201).json(userData)
    }catch(err){
        console.log(err)
        res.status(403).json(err)
    }
}

const userLogin = async (req, res) => {
    try{
        const data = matchedData(req)
        console.log(data.email)
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

        res.json(userData)

    }catch(err){
        console.log(err)
        res.status(403).send('ERROR_LOGIN_USER')
    }
}
/*
const userValidation = async (req, res) => {
    try{

    }catch(err){
        console.log(err)
        res.status(403).send('ERROR_VALIDATING_USER')
    }
}
*/
module.exports = {createItem, userLogin}