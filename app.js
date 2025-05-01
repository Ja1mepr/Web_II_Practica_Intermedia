const express = require('express')
const cors = require('cors')
require('dotenv').config()

const dbConnect = require('./config/mongo')
const {swaggerSpec} = require('./utils/swagger')
const swaggerUi = require('swagger-ui-express')

//Instanciamos la app con express
const app = express()
const routers = require('./routes')

//Aplicamos middleware
app.use(express.json())
app.use(cors())
app.use('/api', routers)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const port = process.env.PORT

app.listen(port, () => {console.log('Servidor escuchando en el puerto ', port)})

dbConnect()