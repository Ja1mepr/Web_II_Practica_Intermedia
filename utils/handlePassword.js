const bcryptjs = require('bcryptjs')

const encrypt = async (clearPassword) => {
    const cryptedPass = bcryptjs.hash(clearPassword, 10)
    return cryptedPass
}

module.exports = {encrypt}