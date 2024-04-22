import express from "express";
import {
    addUserToRoom,
    deleteUserFromRoom,
    getRoomsOfUser,
    getUsersOfRoom
} from "../controllers/usersRoomsController.js";

const router = express.Router();

// Asignar usuario a salas
router.post("/api/users/:userId/salas",addUserToRoom);
// Eliminar asignación de usuario a sala
router.delete("/api/users/:userId/salas/:salaId",deleteUserFromRoom);
// Obtener todas las salas de un usuario
router.get("/api/users/:userId/salas",getRoomsOfUser);
// Obtener todos los usuarios de una sala
router.get("/api/salas/:salaId/users",getUsersOfRoom);


export default router;