import express from "express"; //importamos express
import multer from 'multer'; //importamos multer
import {
    addMaterialToUser,
    deleteMaterialOfUser,
    getAllMaterialsOfUser
} from "../controllers/usersMaterialsController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

// Configuración básica de multer para almacenar archivos en la memoria
const storage = multer.memoryStorage(); // Almacenar en memoria
const upload = multer({ storage }); // Configurar multer con la opción de almacenamiento

//ruta para agregar material a usuario
router.post("/api/users/material", upload.single('archivo'), addMaterialToUser); // 'archivo' es el nombre del campo que esperas recibir
//ruta para obtener todos los materiales de un usuario
router.get("/api/users/:usuario/material", getAllMaterialsOfUser);
//ruta para borrar material de usuario
router.delete("/api/users/:usuario/material/:nombre",deleteMaterialOfUser);

export default router;