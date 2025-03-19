const express = require('express')
const {createItem} = require('../controllers/users')
const { validatorCreateItem } = require('../validators/users')
const router = express.Router()

router.post('/register', validatorCreateItem, createItem)

module.exports = router