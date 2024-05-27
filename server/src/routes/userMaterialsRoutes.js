import express from "express"; //importamos express
import multer from "multer"; //importamos multer
import {
  addMaterialToUser,
  deleteMaterialOfUser,
  getAllMaterialsOfUser,
} from "../controllers/usersMaterialsController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

// Configuración básica de multer para almacenar archivos en la memoria
const storage = multer.memoryStorage(); // Almacenar en memoria
const upload = multer({ storage }); // Configurar multer con la opción de almacenamiento

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del material
 *         archivo:
 *           type: string
 *           format: binary
 *           description: Archivo del material
 */

/**
 * @swagger
 * /api/users/{usuario}/material:
 *  post:
 *    summary: Agrega un nuevo material a un usuario
 *    tags: [Materiales]
 *    parameters:
 *      - in: path
 *        name: usuario
 *        required: true
 *        description: Nombre del usuario
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              archivo:
 *                type: string
 *                format: binary
 *                description: Archivo del material
 *    responses:
 *      201:
 *        description: El material fue agregado exitosamente
 *      500:
 *        description: Error al agregar material
 */

router.post("/api/users/material", upload.single("archivo"), addMaterialToUser); // 'archivo' es el nombre del campo que esperas recibir
/**
 * @swagger
 * /api/users/{usuario}/material:
 *  get:
 *    summary: Obtiene todos los materiales de un usuario
 *    tags: [Materiales]
 *    parameters:
 *      - in: path
 *        name: usuario
 *        required: true
 *        description: Nombre del usuario
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Materiales del usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Material'
 *      500:
 *        description: Error al obtener materiales
 */
router.get("/api/users/:usuario/material", getAllMaterialsOfUser);
/**
 * @swagger
 * /api/users/{usuario}/material/{nombre}:
 *  delete:
 *    summary: Elimina un material de un usuario
 *    tags: [Materiales]
 *    parameters:
 *      - in: path
 *        name: usuario
 *        required: true
 *        description: Nombre del usuario
 *        schema:
 *          type: string
 *      - in: path
 *        name: nombre
 *        required: true
 *        description: Nombre del material
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Material eliminado exitosamente
 *      500:
 *        description: Error al eliminar material
 */
router.delete("/api/users/:usuario/material/:nombre", deleteMaterialOfUser);

export default router;
