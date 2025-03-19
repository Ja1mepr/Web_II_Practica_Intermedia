const UserModel = require('../models/users')
const {matchedData} = require('express-validator')
const {encrypt} = require('../utils/handlePassword')
const {tokenSign} = require('../utils/handleTokenJWT')

const createItem = async (req, res) => {
    try{
        const data = matchedData(req)
        console.log(data)
        //Encriptamos la constraseña
        const password = await encrypt(data.password)

        //Creamos un nuevo objeto modificando la contraseña por la encriptada
        const body = {...data, password} //Si password no es un campo del objeto lo añade,  si no lo sobreescribe
        const user = await UserModel.create(body)

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

module.exports = {createItem}