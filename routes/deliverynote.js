const {getItem, getItems, createItem, downloadItem, signItem, deleteItem} = require('../controllers/deliverynote')
const { validatorCreateItem, validatorSignItem } = require('../validators/deliverynote')
const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/session')

/**
 * @swagger
 * /api/deliverynote/:
 *   get:
 *     summary: Obtener todos los albaranes del usuario autenticado
 *     tags:
 *       - Deliverynote
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 *       403:
 *         description: Error al obtener albaranes
 */
router.get('/', authMiddleware, getItems)

/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     summary: Descargar el PDF del albarán por ID
 *     tags:
 *       - Deliverynote
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: No autorizado o error generando el PDF
 *       404:
 *         description: Albarán no encontrado
 */
router.get('/pdf/:id', authMiddleware, downloadItem)

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán por ID
 *     tags:
 *       - Deliverynote
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       403:
 *         description: Error al obtener el albarán
 */
router.get('/:id', authMiddleware, getItem)

/**
 * @swagger
 * /api/deliverynote/create:
 *   post:
 *     summary: Crear albarán
 *     tags:
 *       - Deliverynote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliverynoteInput'
 *     responses:
 *       200:
 *         description: Albarán creado correctamente
 *       403:
 *         description: Error creando albarán
 */
router.post('/create',  authMiddleware, validatorCreateItem, createItem)

/**
 * @swagger
 * /api/deliverynote/sign/{id}:
 *   patch:
 *     summary: Firmar un albarán
 *     tags:
 *       - Deliverynote
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Albarán firmado correctamente
 *       403:
 *         description: Error firmando el albarán
 */
router.patch('/sign/:id', authMiddleware, validatorSignItem, signItem)

/**
 * @swagger
 * /api/deliverynote/delete/{id}:
 *   delete:
 *     summary: Eliminar un albarán por ID
 *     tags:
 *       - Deliverynote
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán eliminado correctamente o ya firmado
 *       403:
 *         description: Error al eliminar el albarán
 */
router.delete('/delete/:id', authMiddleware, deleteItem)

module.exports = router