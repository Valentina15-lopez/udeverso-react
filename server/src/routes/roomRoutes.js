import express from "express"; //importamos express
import {addRoom, deleteRoom, getAllRooms, getRoom, updateSchedules} from "../controllers/roomController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

//ruta para agregar sala
router.post("/api/salas",addRoom);
//ruta para modificar horarios
router.put("/api/salas/:salaId/horarios",updateSchedules);
//ruta para borrar sala
router.delete("/api/salas/:salaId", deleteRoom);
//ruta para obtener todas las salas
router.get("/api/salas", getAllRooms);
//ruta para obtener una sala
router.get("/api/salas/:salaId",getRoom);


export default router;