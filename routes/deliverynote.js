const {getItem, getItems, createItem, downloadItem, signItem, deleteItem} = require('../controllers/deliverynote')
const { validatorCreateItem, validatorSignItem } = require('../validators/deliverynote')
const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

router.get('/', authMiddleware, getItems)

router.get('/pdf/:id', authMiddleware, downloadItem)

router.get('/:id', authMiddleware, getItem)

router.post('/create',  authMiddleware, validatorCreateItem, createItem)

router.patch('/sign', authMiddleware, validatorSignItem, signItem)

router.delete('/delete/:id', authMiddleware, deleteItem)

module.exports = router