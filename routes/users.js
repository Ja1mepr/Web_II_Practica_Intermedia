const express = require('express')
const {getItem, createItem, userLogin, validateUser, hardDeleteItem, softDeleteItem} = require('../controllers/users')
const { validatorCreateItem, validatorLogin, validatorCode } = require('../validators/users')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

router.get('/', authMiddleware, getItem)

router.post('/register', validatorCreateItem, createItem)

router.put('/validation', authMiddleware, validatorCode, validateUser)

router.post('/login', validatorLogin, userLogin)

router.delete('/hardDelete', authMiddleware, hardDeleteItem)

router.patch('/softDelete', authMiddleware, softDeleteItem)

module.exports = router