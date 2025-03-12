const express = require('express')
const cors = require('cors')
require('dotenv').config()

const dbConnect = require('./config/mongo')

//Instanciamos la app con express
const app = express()

//Aplicamos middleware
app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.listen(port, () => {console.log('Servidor escuchando en el puerto ', port)})

dbConnect()