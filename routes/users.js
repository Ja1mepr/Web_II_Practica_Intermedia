const express = require('express')
const { getItem, createItem, userLogin, validateUser, updateItem, deleteItem } = require('../controllers/users')
const { validatorCreateItem, validatorLogin, validatorCode, validatorUpdateItem } = require('../validators/users')
const router = express.Router()
const { authMiddleware } = require('../middleware/session')

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       403:
 *         description: Petición no autorizada
 *       401:
 *         description: Credenciales de autentificación no válidas
 */
router.get('/', authMiddleware, getItem)

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
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
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       403:
 *         description: Peticion no autorizada
 */
router.post('/register', validatorCreateItem, createItem)

/**
 * @swagger
 * /users/validation:
 *   put:
 *     summary: Validar usuario con código enviado por email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario validado
 *       403:
 *         description: Petición no autorizada
 *       401:
 *        description: Credenciales de autentificación no válidas
 */
router.put('/validation', authMiddleware, validatorCode, validateUser)

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Completar datos del usuario tras registro
 *     tags: [Users]
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
 *               lastName:
 *                 type: string
 *               nif:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos del usuario actualizados
 *       403:
 *         description: Petición no autorizada
 *       401:
 *        description: Credenciales de autentificación no válidas
 */
router.patch('/update', authMiddleware, validatorUpdateItem, updateItem)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Recurso no encontrado
 */
router.post('/login', validatorLogin, userLogin)

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Eliminar usuario (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario marcado como eliminado
 *       403:
 *         description: Petición no autorizada
 *       401:
 *        description: Credenciales de autentificación no válidas
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/delete', authMiddleware, deleteItem)

module.exports = router