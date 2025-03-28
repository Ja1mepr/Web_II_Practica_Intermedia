const express = require('express')
const {createItem, userLogin, validateUser} = require('../controllers/users')
const { validatorCreateItem, validatorLogin, validatorCode } = require('../validators/users')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

router.post('/register', validatorCreateItem, createItem)

router.put('/validation', authMiddleware, validatorCode, validateUser)

router.post('/login', validatorLogin, userLogin)

module.exports = router