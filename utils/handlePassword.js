const bcryptjs = require('bcryptjs')

const encrypt = async (clearPassword) => {
    const cryptedPass = bcryptjs.hash(clearPassword, 10)
    return cryptedPass
}

const compare = async (clearPassword, hashedPassword) => {
    return (await bcryptjs.compare(clearPassword, hashedPassword))
}

module.exports = {encrypt, compare}