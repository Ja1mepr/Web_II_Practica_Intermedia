const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

const tokenSign = async (user) => {
    const sign = jwt.sign(
        {
            _id: user.id
            //role: user.rol
        },
        jwt_secret,
        {
            expiresIn: "2h"
        }
    )
    return sign
}

const verifyToken = async (tokenJwt) => {
    try{
        return jwt.verify(tokenJwt, jwt_secret)
    }catch(err){
        console.log(err)
    }
}

module.exports = {tokenSign, verifyToken}