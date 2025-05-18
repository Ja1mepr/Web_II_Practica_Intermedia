const { verifyToken } = require('../utils/handleTokenJWT')
const UserModel = require('../models/users')

const authMiddleware = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            res.status(403).send("NOT_TOKEN")
            return 
        }
        const token = req.headers.authorization.split(' ').pop()
        const dataToken = await verifyToken(token)
        if(!dataToken._id){
            res.status(403).send("ERROR_ID_TOKEN") 
            return
        }
        const user = await UserModel.findById(dataToken._id)
        req.user = user
        
        next()
    }catch(err){
        console.log(err)
        res.status(401).send("NOT_SESSION")
    }
}

module.exports = {authMiddleware}