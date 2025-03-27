const express = require('express')
const { createItem } = require('../controllers/storage')
const router = express.Router()
const uploadMiddleware = require('../utils/handleStorage')

router.patch("/logo", uploadMiddleware.single('image'), createItem)

module.exports = router