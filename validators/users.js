const {check} = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check('name').exists().notEmpty(),
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty().isLength({min: 8}),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorLogin = [
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty(),
    (req, res, next) => {return validateResults(req, res, next)}
]
const validatorCode = [
    check('code').exists().notEmpty().isLength({min: 6}, {max: 6}),
    (req, res, next) => {return validateResults(req, res, next)}
]

module.exports = {validatorCreateItem, validatorLogin}