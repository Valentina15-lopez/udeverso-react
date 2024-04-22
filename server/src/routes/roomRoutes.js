import express from "express";
import {addRoom, deleteRoom, getAllRooms, getRoom, updateSchedules} from "../controllers/roomController.js";

const router = express.Router();

//agregar sala
router.post("/api/salas",addRoom);
//modificar horarios
router.put("/api/salas/:salaId/horarios",updateSchedules);
//borrar sala
router.delete("/api/salas/:salaId", deleteRoom);
//obtener todas las salas
router.get("/api/salas", getAllRooms);
//obtener sala
router.get("/api/salas/:salaId",getRoom);


export default router;