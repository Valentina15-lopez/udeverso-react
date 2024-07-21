// src/routes/userRoutes.js
import express from "express"; //importamos express
import {
  checkAuth,
  login,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyToken,
  getAvatar,
  postAvatar,
} from "../controllers/userController.js"; //importamos los controladores
import usersList from "../../index.js";

const router = express.Router(); //creamos el router

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 */

/**
 * @swagger
 * /api/checkAuth:
 *  get:
 *    summary: Verifica si el usuario está autenticado
 *    tags: [Usuarios]
 *    responses:
 *      200:
 *        description: El usuario está autenticado
 *      401:
 *        description: El usuario no está autenticado
 */
router.get("/api/checkAuth", checkAuth);
/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: Inicia sesión con un usuario
 *    tags: [Usuarios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: Correo electrónico del usuario
 *              password:
 *                type: string
 *                description: Contraseña del usuario
 *    responses:
 *      200:
 *        description: Sesión iniciada con éxito
 *      401:
 *        description: Error al iniciar sesión
 */
router.post("/login", login);
/**
 * @swagger
 * /api/users:
 *  post:
 *    summary: Crea un nuevo usuario
 *    tags: [Usuarios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      201:
 *        description: Usuario creado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      400:
 *        description: Error al crear usuario
 */
router.post("/api/users", createUser);
/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Obtiene todos los usuarios
 *    tags: [Usuarios]
 *    responses:
 *      200:
 *        description: Lista de usuarios
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Usuario'
 */
router.get("/api/users", getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    summary: Obtiene un usuario por su ID
 *    tags: [Usuarios]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Usuario encontrado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      404:
 *        description: Usuario no encontrado
 */
router.get("/api/users/:usuario", getUser);
/**
 * @swagger
 * /api/users/{usuario}:
 *  put:
 *    summary: Actualiza un usuario
 *    tags: [Usuarios]
 *    parameters:
 *      - in: path
 *        name: usuario
 *        required: true
 *        description: Nombre de usuario
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Usuario actualizado exitosamente
 *      404:
 *        description: Usuario no encontrado
 */
router.put("/api/users/:usuario", updateUser);
/**
 * @swagger
 * /api/users/{usuario}:
 *  delete:
 *    summary: Elimina un usuario
 *    tags: [Usuarios]
 *    parameters:
 *      - in: path
 *        name: usuario
 *        required: true
 *        description: Nombre de usuario
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Usuario eliminado exitosamente
 *      404:
 *        description: Usuario no encontrado
 */
router.delete("/api/users/:usuario", deleteUser);

router.post("/api/updateAvatar/:userName", (req, res) => {
  const { userName } = req.params;
  const { hairColor, topColor, bottomColor } = req.body;
  console.log(req, res);
  const user = usersList.find((user) => user.userName === userName);
  if (user) {
    user.hairColor = hairColor;
    user.topColor = topColor;
    user.bottomColor = bottomColor;
    io.emit("usersList", usersList);
    res.status(200).json({ message: "Avatar actualizado" });
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

export default router;
