const {check} = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty().isLength({min: 8}),
    (req, res, next) => {return validateResults(req, res, next)}
]

module.exports = {validatorCreateItem}