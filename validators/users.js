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
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty(),
    check('code').exists().notEmpty().isLength({min: 6}, {max: 6}),
    (req, res, next) => {return validateResults(req, res, next)}
]

const validatorOnBoarding = [
    check('name').exists().notEmpty(),
    check('lastName').exists().notEmpty(),
    check('nif').exists().notEmpty().isLength({min: 9}, {max: 9}),
    (req, res, next) => { return validateResults(req, res, next) }
]

module.exports = {validatorCreateItem, validatorLogin, validatorCode, validatorOnBoarding}