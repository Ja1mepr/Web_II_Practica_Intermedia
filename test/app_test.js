const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./config')

//Instanciamos la app con express
const app = express()
const routers = require('../routes')

//Aplicamos middleware
app.use(express.json())
app.use(cors())
app.use('/api', routers)

module.exports = app