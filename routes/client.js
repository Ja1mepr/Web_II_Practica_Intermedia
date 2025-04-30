const express = require('express')
const {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem} = require('../controllers/client')
const { validatorCreateItem, validatorUpdateItem, validatorDeleteItem, validatorRecoverItem } = require('../validators/client')
const {authMiddleware} = require('../middleware/session')
const router = express.Router()

router.get('/archived', getArchivedItems)

router.get('/:id', getItem)

router.get('/', authMiddleware, getItems)

router.post('/create', authMiddleware, validatorCreateItem, createItem)

router.patch('/update', authMiddleware, validatorUpdateItem, updateItem)

router.patch('/recover', authMiddleware, validatorRecoverItem, recoverArchivedItem)

router.delete('/delete', authMiddleware, validatorDeleteItem, deleteItem)

module.exports = router