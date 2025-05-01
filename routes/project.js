const express = require('express')
const { getItem, getItems, createItem, updateItem, deleteItem, getArchivedItems, recoverArchivedItem } = require('../controllers/project')
const { validatorCreateItem, validatorUpdateItem, validatorDeleteItem, validatorRecoverItem } = require('../validators/project')
const router = express.Router()
const { authMiddleware } = require('../middleware/session')

/**
 * @swagger
 * /project/archived:
 *   get:
 *     summary: Obtener todos los proyectos archivados
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: Proyectos obtenidos
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/archived', authMiddleware, getArchivedItems)

/**
* @swagger
* /project/{id}:
*   get:
*     summary: Obtener un proyecto por su ID
*     tags: [Project]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: ID del proyecto
*     responses:
*       200:
 *         description: Proyecto obtenido
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Proyecto no encontrado
*/
router.get('/:id', authMiddleware, getItem)

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Obtener todos los proyectos del usuario autenticado
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proyectos obtenidos
 *       401:
 *         description: Credenciales de autentificación no válidas
 *       403:
 *         description: Petición no autorizada
 */
router.get('/', authMiddleware, getItems)

/**
 * @swagger
 * /project/create:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Project]
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
 *                 example: Proyecto Ejemplo
 *               client_associated:
 *                 type: string
 *                 example: 661f6c03eaf13e2b0ffdf123
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado
 */
router.post('/create', authMiddleware, validatorCreateItem, createItem)

/**
 * @swagger
 * /project/update/{id}:
 *   patch:
 *     summary: Actualizar un proyecto existente
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Proyecto Actualizado
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch('/update/:id', authMiddleware, validatorUpdateItem, updateItem)

/**
 * @swagger
 * /project/recover:
 *   patch:
 *     summary: Recuperar un proyecto archivado
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 661f6c03eaf13e2b0ffdf456
 *     responses:
 *       200:
 *         description: Proyecto recuperado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Proyecto no encontrado
 */
router.patch('/recover', authMiddleware, validatorRecoverItem, recoverArchivedItem)

/**
 * @swagger
 * /project/delete:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 661f6c03eaf13e2b0ffdf456
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Petición no autorizada
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/delete', authMiddleware, validatorDeleteItem, deleteItem)

module.exports = router