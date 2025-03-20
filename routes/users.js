const express = require('express')
const {createItem, userLogin} = require('../controllers/users')
const { validatorCreateItem, validatorLogin } = require('../validators/users')
const router = express.Router()

router.post('/register', validatorCreateItem, createItem)

router.post('/login', validatorLogin, userLogin)

module.exports = router