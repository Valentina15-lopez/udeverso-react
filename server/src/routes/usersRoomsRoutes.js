import express from "express"; //importamos express
import {
    addUserToRoom,
    deleteUserFromRoom,
    getRoomsOfUser,
    getUsersOfRoom
} from "../controllers/usersRoomsController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioSala:
 *       type: object
 *       properties:
 *         usuario:
 *           type: string
 *           description: Nombre del usuario
 *         sala:
 *           type: string
 *           description: Nombre de la sala
 */

/**
 * @swagger
 * /api/users/{userId}/salas:
 *  post:
 *    summary: Agrega un usuario a una sala
 *    tags: [Usuarios-Salas]
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UsuarioSala'
 *    responses:
 *      201:
 *        description: El usuario fue agregado a la sala exitosamente
 *      500:
 *        description: Error al agregar usuario a la sala
 */
router.post("/api/users/:userId/salas",addUserToRoom);
/**
 * @swagger
 * /api/users/{userId}/salas/{salaId}:
 *  delete:
 *    summary: Elimina un usuario de una sala
 *    tags: [Usuarios-Salas]
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *      - in: path
 *        name: salaId
 *        required: true
 *        description: ID de la sala
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: El usuario fue eliminado de la sala exitosamente
 *      500:
 *        description: Error al eliminar usuario de la sala
 */
router.delete("/api/users/:userId/salas/:salaId",deleteUserFromRoom);
/**
 * @swagger
 * /api/users/{userId}/salas:
 *  get:
 *    summary: Obtiene todas las salas de un usuario
 *    tags: [Usuarios-Salas]
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Salas del usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Sala'
 *      500:
 *        description: Error al obtener salas
 */
router.get("/api/users/:userId/salas",getRoomsOfUser);
/**
 * @swagger
 * /api/salas/{salaId}/users:
 *  get:
 *    summary: Obtiene todos los usuarios de una sala
 *    tags: [Usuarios-Salas]
 *    parameters:
 *      - in: path
 *        name: salaId
 *        required: true
 *        description: ID de la sala
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Usuarios de la sala
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Usuario'
 *      500:
 *        description: Error al obtener usuarios
 */
router.get("/api/salas/:salaId/users",getUsersOfRoom);

export default router;