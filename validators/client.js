const {check} = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check('name').exists().notEmpty(),
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty().isLength({min: 8}),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorUpdateItem = [
    check('name').exists().notEmpty(),
    check('email').exists().notEmpty().isEmail(),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorDeleteItem = [
    check('email').exists().notEmpty().isEmail(),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorRecoverItem = [
    check('email').exists().notEmpty().isEmail(),
    (req, res, next) => {return validateResults(req, res, next)}
]

module.exports = {validatorCreateItem, validatorUpdateItem, validatorDeleteItem, validatorRecoverItem}