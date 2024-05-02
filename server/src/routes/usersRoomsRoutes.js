import express from "express"; //importamos express
import {
    addUserToRoom,
    deleteUserFromRoom,
    getRoomsOfUser,
    getUsersOfRoom
} from "../controllers/usersRoomsController.js"; //importamos los controladores

const router = express.Router(); //creamos el router

//ruta para agregar usuario a sala
router.post("/api/users/:userId/salas",addUserToRoom);
//ruta para borrar usuario de sala
router.delete("/api/users/:userId/salas/:salaId",deleteUserFromRoom);
//ruta para obtener todas las salas de un usuario
router.get("/api/users/:userId/salas",getRoomsOfUser);
//ruta para obtener todos los usuarios de una sala
router.get("/api/salas/:salaId/users",getUsersOfRoom);

export default router;