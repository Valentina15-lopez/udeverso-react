import express from "express"; //importamos express
import {
  addRoom,
  deleteRoom,
  getAllRooms,
  getRoom,
  updateSchedules,
} from "../controllers/roomController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

/**
 * @swagger
 * components:
 *   schemas:
 *     Sala:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción de la sala
 *         horarios:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dia_semana:
 *                 type: number
 *                 description: Día de la semana
 *               hora_inicio:
 *                 type: string
 *                 description: Hora de inicio
 *               hora_fin:
 *                 type: string
 *                 description: Hora de fin
 */

/**
 * @swagger
 * /api/salas:
 *  post:
 *     summary: Agrega una nueva sala con sus horarios
 *     tags: [Salas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sala'
 *     responses:
 *       201:
 *         description: La sala fue agregada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 *       400:
 *         description: Formato de horarios incorrecto
 *       500:
 *         description: Error al agregar sala y horarios
 */
router.post("/api/salas", addRoom);
/**
 * @swagger
 * /api/salas/{salaId}/horarios:
 *  put:
 *      summary: Actualiza los horarios de una sala
 *      tags: [Salas]
 *      parameters:
 *          - in: path
 *            name: salaId
 *            required: true
 *            description: ID de la sala
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              dia_semana:
 *                                  type: number
 *                                  description: Día de la semana
 *                              hora_inicio:
 *                                  type: string
 *                                  description: Hora de inicio
 *                              hora_fin:
 *                                  type: string
 *                                  description: Hora de fin
 *      responses:
 *          200:
 *              description: Horarios actualizados exitosamente
 *          400:
 *              description: Formato de horarios incorrecto
 *          500:
 *              description: Error al actualizar horarios
 */
router.put("/api/salas/:salaId/horarios", updateSchedules);
/**
 * @swagger
 * /api/salas/{salaId}:
 *  delete:
 *      summary: Elimina una sala
 *      tags: [Salas]
 *      parameters:
 *          - in: path
 *            name: salaId
 *            required: true
 *            description: ID de la sala
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Sala eliminada exitosamente
 *          500:
 *              description: Error al eliminar sala
 */
router.delete("/api/salas/:salaId", deleteRoom);
/**
 * @swagger
 * /api/salas:
 *  get:
 *      summary: Obtiene todas las salas con sus horarios
 *      tags: [Salas]
 *      responses:
 *          200:
 *              description: Salas obtenidas exitosamente
 *              content:
 *                  application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Sala'
 */
router.get("/api/salas", getAllRooms);
/**
 * @swagger
 * /api/salas/{salaId}:
 *  get:
 *      summary: Obtiene una sala con sus horarios
 *      tags: [Salas]
 *      parameters:
 *          - in: path
 *            name: salaId
 *            required: true
 *            description: ID de la sala
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Sala obtenida exitosamente
 *              content:
 *                  application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Sala'
 *          404:
 *              description: Sala no encontrada
 */
router.get("/api/salas/:salaId", getRoom);

// Endpoint para actualizar el avatar
router.post("/api/updateAvatar", (req, res) => {
  const { hairColor, topColor, bottomColor } = req.body;
  // Aquí podrías actualizar la información del usuario en una base de datos
  console.log("Datos recibidos:", { hairColor, topColor, bottomColor });

  // Responde con un mensaje de éxito
  res.status(200).send("Avatar actualizado con éxito");
});

export default router;
