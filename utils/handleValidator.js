const { validationResult } = require('express-validator')

const validateResults = (req, res, next) => {
    try{
        validationResult(req).throw()
        next()
    }catch(err){
        res.status(403).send({errors: err.array()})
    }
}

module.exports = validateResults