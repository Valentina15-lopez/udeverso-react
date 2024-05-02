// src/routes/userRoutes.js
import express from "express"; //importamos express
import {
    checkAuth,
    login,
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

//ruta para verificar autenticación
router.get("/api/checkAuth", checkAuth);
//ruta para iniciar sesión
router.post("/login", login);
//ruta para crear usuario
router.post("/api/users", createUser);
//ruta para obtener todos los usuarios
router.get("/api/users", getAllUsers);
//ruta para obtener un usuario
router.get("/api/users/:id", getUser);
//ruta para modificar usuario
router.put("/api/users/:usuario",updateUser);
//ruta para borrar usuario
router.delete("/api/users/:usuario",deleteUser);

export default router;
