const express = require('express')
const {getItem, createItem, userLogin, validateUser, onBoarding, deleteItem} = require('../controllers/users')
const { validatorCreateItem, validatorLogin, validatorCode, validatorOnBoarding } = require('../validators/users')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

router.get('/', authMiddleware, getItem)

router.post('/register', validatorCreateItem, createItem)

router.put('/validation', authMiddleware, validatorCode, validateUser)

router.patch('/onBoarding', authMiddleware, validatorOnBoarding, onBoarding)

router.post('/login', validatorLogin, userLogin)

router.delete('/delete', authMiddleware, deleteItem)

module.exports = router