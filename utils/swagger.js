const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      components: {
        securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
      },
      title: 'API Practica Web',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar usuarios, clientes, proyectos y albaranes',
    },
    servers: [
      {
        url: 'http://localhost:3005/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas donde pondrás los comentarios
}

const swaggerSpec = swaggerJsDoc(options)

module.exports = {swaggerSpec}