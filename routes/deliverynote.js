const {getItem, getItems, createItem, userLogin, validateUser, onBoarding, deleteItem} = require('../controllers/deliverynote')
const { validatorCreateItem, validatorLogin, validatorCode, validatorOnBoarding } = require('../validators/deliverynote')
const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

router.get('/', authMiddleware, getItems)

router.get('/:id', getItem)

router.post('/create',  authMiddleware, validatorCreateItem, createItem)

// router.put('/validation', authMiddleware, validatorCode, validateUser)

// router.patch('/onBoarding', authMiddleware, validatorOnBoarding, onBoarding)

// router.post('/login', validatorLogin, userLogin)

// router.delete('/delete', authMiddleware, deleteItem)

module.exports = router