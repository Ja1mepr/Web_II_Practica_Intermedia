const express = require('express')
const { getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem } = require('../controllers/project')
const { validatorCreateItem, validatorUpdateItem, validatorDeleteItem, validatorRecoverItem } = require('../validators/project')
const router = express.Router()
const { authMiddleware } = require('../middleware/session')

router.get('/archived', getArchivedItems)

router.get('/:id', getItem)

router.get('/', authMiddleware, getItems)

router.post('/create', authMiddleware, validatorCreateItem, createItem)

router.patch('/update/:id', authMiddleware, validatorUpdateItem, updateItem)

router.patch('/recover', authMiddleware, validatorRecoverItem, recoverArchivedItem)

router.delete('/delete', authMiddleware, validatorDeleteItem, deleteItem)

module.exports = router