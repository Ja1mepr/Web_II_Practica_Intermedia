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

module.exports = {tokenSign}