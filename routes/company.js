const express = require('express')
const {validatorCreateItem} = require('../validators/company')
const { authMiddleware } = require('../middleware/session')
const { onBoarding } = require('../controllers/company')
const router = express.Router()

/**
 * @swagger
 * /company/onBoarding:
 *   patch:
 *     summary: Crear la empresa si el usuario es autonomo, si no, en caso de que la compañia exista, lo añade como empleado
 *     tags: [Company]
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
 *                 example: Empresa S.L.
 *               cif:
 *                 type: string
 *                 example: B12345678
 *               address:
 *                 type: string
 *                 example: Calle Falsa 123, Madrid
 *     responses:
 *       200:
 *         description: Empresa creada o actualizada correctamente
 *       400:
 *         description: Error de validación en los datos de entrada
 *       401:
 *         description: No autorizado
 */
router.patch('/onBoarding', authMiddleware, validatorCreateItem, onBoarding)

module.exports = router