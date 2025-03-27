const express = require('express')
const {createItem, userLogin, validateUser} = require('../controllers/users')
const { validatorCreateItem, validatorLogin, validatorCode } = require('../validators/users')
const router = express.Router()

router.post('/register', validatorCreateItem, createItem)

router.put('/validation', validatorCode, validateUser)

router.post('/login', validatorLogin, userLogin)

module.exports = router