const express = require('express')
const {getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem} = require('../controllers/client')
const { validatorCreateItem, validatorUpdateItem, validatorDeleteItem, validatorRecoverItem } = require('../validators/client')
const {authMiddleware} = require('../middleware/session')
const router = express.Router()

/**
 * @swagger
 * /clients/archived:
 *   get:
 *     summary: Obtener clientes archivados
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 *       403:
 *         description: Petición no autorizada
 *       401:
 *         description: Credenciales de autentificación no válidas
 */
router.get('/archived', authMiddleware, getArchivedItems)

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', authMiddleware, getItem)

/**
 * @swagger
 * /clients/:
 *   get:
 *     summary: Obtener todos los clientes del usuario
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 */
router.get('/', authMiddleware, getItems)

/**
 * @swagger
 * /clients/create:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email: 
 *                  type: string 
 *               password: 
 *                  type: string 
 *               address:
 *                 type: string
 *               nif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 */
router.post('/create', authMiddleware, validatorCreateItem, createItem)

/**
 * @swagger
 * /clients/update:
 *   patch:
 *     summary: Actualizar datos de un cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                  type:string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Cliente no encontrado
 */
router.patch('/update', authMiddleware, validatorUpdateItem, updateItem)

/**
 * @swagger
 * /clients/recover:
 *   patch:
 *     summary: Recuperar un cliente archivado
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente recuperado
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Cliente no encontrado
 */
router.patch('/recover', authMiddleware, validatorRecoverItem, recoverArchivedItem)

/**
 * @swagger
 * /clients/delete:
 *   delete:
 *     summary: Eliminar(hard delete) o archivar(soft delete) un cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/delete', authMiddleware, validatorDeleteItem, deleteItem)

module.exports = router