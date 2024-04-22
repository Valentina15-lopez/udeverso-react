import express from "express";
import multer from 'multer';
import {
    addMaterialToUser,
    deleteMaterialOfUser,
    getAllMaterialsOfUser
} from "../controllers/usersMaterialsController.js";

const router = express.Router();

// Configuración básica de multer para almacenar archivos en la memoria
const storage = multer.memoryStorage(); // Puedes almacenar archivos en la memoria o en el sistema de archivos
const upload = multer({ storage }); // Aquí puedes agregar restricciones adicionales como límites de tamaño, tipos de archivos, etc.

//agregar material a una sala
router.post("/api/users/material", upload.single('archivo'), addMaterialToUser); // 'archivo' es el nombre del campo que esperas recibir
//obtener todos los materiales de usuario
router.get("/api/users/:usuario/material", getAllMaterialsOfUser);
//borrar material de usuario
router.delete("/api/users/:usuario/material/:nombre",deleteMaterialOfUser);


export default router;