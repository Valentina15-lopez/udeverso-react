import sequelize from "../config/database.js";
import {Salas, UsuariosSalas, Usuarios} from "../models/index.js";

export const addUserToRoom = async (req, res) => {
    //console.log("Se llamó al endpoint POST /api/users/:userId/salas con " + JSON.stringify(req.body));

    const transaction = await sequelize.transaction();  // Iniciar una transacción

    try {
        const userId = req.params.userId;  // El usuario al que se asignarán las salas
        const { salaIds } = req.body;  // Los IDs de las salas a las que se asignará el usuario

        // Validar que salaIds es un array
        if (!Array.isArray(salaIds)) {
            await transaction.rollback();  // Revertir la transacción
            return res.status(400).json({ message: "salaIds debe ser un array" });  // Devolver 400 con mensaje
        }

        for (const salaId of salaIds) {
            await UsuariosSalas.create(
                {
                    user_id: userId,
                    sala_id: salaId,
                },
                {
                    transaction,  // Dentro de la transacción
                    ignoreDuplicates: true,  // Para evitar duplicados
                }
            );
        }

        await transaction.commit();  // Confirmar la transacción
        //console.log("Usuario asignado a las salas exitosamente.");
        return res.status(201).json({ message: "Usuario asignado a las salas exitosamente." }); // Operación exitosa
    } catch (error) {
        await transaction.rollback();  // Revertir la transacción en caso de error
        console.error("Error al asignar usuario a salas:", error.message);
        res.status(500).json({ message: "Error al asignar usuario a salas." });  // Manejo de errores
    }
};

export const deleteUserFromRoom = async (req, res) => {
    try {
        const userId = req.params.userId;  // El ID del usuario
        const salaId = parseInt(req.params.salaId, 10);  // El ID de la sala

        const deletedCount = await UsuariosSalas.destroy({
            where: {
                user_id: userId,  // Condición para el usuario
                sala_id: salaId,  // Condición para la sala
            },
        });

        if (deletedCount > 0) {
            //console.log("Usuario eliminado de la sala.");
            return res.status(200).json({ message: "Usuario eliminado de la sala." }); // Operación exitosa
        } else {
            //console.log("No se encontró la relación entre usuario y sala.");
            return res.status(404).json({message: "No se encontró la relación entre usuario y sala."}); // No encontrado
        }
    } catch (error) {
        console.error("Error al eliminar usuario de la sala:", error.message);
        res.status(500).json({ message: "Error al eliminar usuario de la sala." });  // Manejo de errores
    }
};

export const getRoomsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;  // El ID del usuario para el que queremos obtener las salas

        // Usar `findAll` con `include` para obtener todas las salas asociadas a un usuario
        const rooms = await UsuariosSalas.findAll({
            where: { user_id: userId },  // Filtrar por el usuario
            include: [
                {
                    model: Salas,  // Incluir las salas asociadas
                    as: 'sala',  // Alias para la relación
                },
            ],
        });

        // Extraer solo las salas de la respuesta
        const salas = rooms.map(room => room.sala);

        res.status(200).json(salas);  // Devolver todas las salas asociadas al usuario
    } catch (error) {
        console.error("Error al obtener salas del usuario:", error.message);
        res.status(500).json({ message: "Error al obtener salas del usuario." });
    }
};

export const getUsersOfRoom = async (req, res) => {
    try {
        const salaId = parseInt(req.params.salaId, 10);  // ID de la sala

        // Obtener todos los usuarios asociados a una sala específica
        const usersInRoom = await UsuariosSalas.findAll({
            where: { sala_id: salaId },  // Filtrar por la sala
            include: [
                {
                    model: Usuarios,  // Incluir el modelo Usuario para obtener datos del usuario
                    as: 'usuario',  // Alias para la relación
                },
            ],
        });

        // Extraer solo los usuarios de la respuesta
        const usuarios = usersInRoom.map(us => us.usuario);

        res.status(200).json(usuarios);  // Devolver todos los usuarios asociados a la sala
    } catch (error) {
        console.error("Error al obtener usuarios de la sala:", error.message);
        res.status(500).json({ message: "Error al obtener usuarios de la sala." });
    }
};
