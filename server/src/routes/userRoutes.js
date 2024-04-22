// src/routes/userRoutes.js
import express from "express";
import {
    checkAuth,
    login,
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

//autenticacion
router.get("/api/checkAuth", checkAuth);
//login
router.post("/login", login);
//agregar usuario
router.post("/api/users", createUser);
//obtener todos los usuarios
router.get("/api/users", getAllUsers);
//obtener usuario
router.get("/api/users/:id", getUser);
//modificar usuario
router.put("/api/users/:usuario",updateUser);
//borrar usuario
router.delete("/api/users/:usuario",deleteUser);


export default router;
