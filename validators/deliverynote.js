const {check} = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check('project_name').exists().notEmpty(),
    check('number').exists().notEmpty(),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorSignItem = [
    check('signature').exists().notEmpty(),
    (req, res, next) => {return validateResults(req, res, next)}
]

module.exports = {validatorCreateItem, validatorSignItem}