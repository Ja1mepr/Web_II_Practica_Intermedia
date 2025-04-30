const {check} = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check('name').exists().notEmpty().isString(),
    check('cif').exists().notEmpty().isLength({min: 9}, {max: 9}),
    (req, res, next) => { return validateResults(req, res, next) }
]

module.exports = {validatorCreateItem}