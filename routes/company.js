const express = require('express')
const {validatorCreateItem} = require('../validators/company')
const { authMiddleware } = require('../middleware/session')
const { onBoarding } = require('../controllers/users')
const router = express.Router()

router.patch('/onBoarding', authMiddleware, validatorCreateItem, onBoarding)

module.exports = router