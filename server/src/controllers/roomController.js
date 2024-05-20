import {v4 as uuidV4} from "uuid"; // Importar la función uuidV4
import sequelize from "../config/database.js"; // Importar la instancia de la clase Sequelize
import {HorariosSalas, Salas} from "../models/index.js"; // Importar los modelos HorariosSalas y Salas

export const addRoom = async (req, res) => {
    const { descripcion, horarios } = req.body; // Extraer la descripción y los horarios

    const transaction = await sequelize.transaction();  // Iniciar una transacción

    try {
        // Crear la nueva sala dentro de una transacción
        const nuevaSala = await Salas.create(
            { descripcion },
            { transaction }
        );

        // Validación básica para horarios
        if (!Array.isArray(horarios)) {
            return res.status(400).json({ message: "El formato de horarios debe ser un array." });
        }

        // Insertar los horarios para esta sala dentro de la transacción
        for (const horario of horarios) {
            const { dia_semana, hora_inicio, hora_fin } = horario;

            if (
                typeof dia_semana !== "number" ||
                typeof hora_inicio !== "string" ||
                typeof hora_fin !== "string"
            ) { // Validar los tipos de datos
                return res.status(400).json({ message: "Horarios mal formateados." });
            }

            await HorariosSalas.create(
                {
                    sala_id: nuevaSala.id,
                    dia_semana,
                    hora_inicio,
                    hora_fin,
                },
                { transaction }
            );
        }

        await transaction.commit();  // Confirmar la transacción

        res.status(201).send("Sala y horarios agregados exitosamente");
    } catch (error) {
        await transaction.rollback();  // Revertir la transacción en caso de error
        console.error("Error al agregar sala y horarios:", error.message);
        res.status(500).json({ message: "Error al agregar sala y horarios" });
    }
};

export const updateSchedules = async (req, res) => {

    const transaction = await sequelize.transaction();  // Iniciar una transacción

    try {
        const salaId = parseInt(req.params.salaId, 10);  // Convertir a número
        const { horarios } = req.body;

        // Validación básica para horarios
        if (!Array.isArray(horarios)) {
            return res.status(400).json({ message: "El formato de horarios debe ser un array." });
        }

        // Eliminar los horarios existentes para la sala dentro de la transacción
        await HorariosSalas.destroy({
            where: { sala_id: salaId },
            transaction,
        });

        // Insertar los nuevos horarios
        for (const horario of horarios) {
            const { dia_semana, hora_inicio, hora_fin } = horario;

            if (
                typeof dia_semana !== "number" ||
                typeof hora_inicio !== "string" ||
                typeof hora_fin !== "string"
            ) { // Validar los tipos de datos
                return res.status(400).json({ message: "Horarios mal formateados." });
            }

            // Crear nuevos registros de horarios dentro de la transacción
            await HorariosSalas.create(
                {
                    sala_id: salaId,
                    dia_semana,
                    hora_inicio,
                    hora_fin,
                },
                { transaction }
            );
        }

        await transaction.commit();  // Confirmar la transacción

        res.status(200).send("Horarios modificados exitosamente.");  // Respuesta exitosa
    } catch (error) {
        await transaction.rollback();  // Revertir la transacción en caso de error
        console.error("Error al modificar horarios:", error.message);
        res.status(500).json({ message: "Error al modificar horarios." });  // Manejo de errores
    }
};

export const deleteRoom = async (req, res) => {
    const transaction = await sequelize.transaction();  // Iniciar una transacción

    try {
        const salaId = parseInt(req.params.salaId, 10);// Convertir a número

        // Verificar si la sala existe
        const sala = await Salas.findOne({
            where: { id: salaId },
            transaction,  // Usar la transacción
        });

        if (!sala) {
            await transaction.rollback();  // Revertir la transacción si la sala no se encuentra
            return res.status(404).json({ message: "Sala no encontrada" });
        }

        // Eliminar horarios asociados a la sala
        await HorariosSalas.destroy({
            where: { sala_id: salaId },
            transaction,  // Usar la transacción
        });

        // Eliminar la sala
        await Salas.destroy({
            where: { id: salaId },
            transaction,  // Usar la transacción
        });

        await transaction.commit();  // Confirmar la transacción

        res.status(200).json({message: "Sala y horarios eliminados exitosamente"});  // Respuesta exitosa
    } catch (error) {
        await transaction.rollback();  // Revertir la transacción en caso de error
        console.error("Error al borrar la sala:", error.message);
        res.status(500).json({ message: "Error al borrar la sala" });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        // Obtener todas las salas con sus horarios asociados
        const salas = await Salas.findAll({
            include: [
                {
                    model: HorariosSalas,  // Incluir los horarios asociados
                    as: 'horarios',  // Alias para la relación
                    order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']],  // Ordenar por día y hora
                },
            ],
            order: [['id', 'ASC']],  // Ordenar las salas por ID
        });

        res.status(200).json(salas);  // Devolver las salas y sus horarios
    } catch (error) {
        console.error("Error al obtener salas:", error.message);
        res.status(500).json({ message: "Error al obtener salas" });
    }
};

export const getRoom = async (req, res) => {
    try {
        const salaId = parseInt(req.params.salaId, 10);

        // Obtener la sala con sus horarios asociados
        const sala = await Salas.findOne({
            where: { id: salaId },  // Condición para buscar la sala
            include: [
                {
                    model: HorariosSalas,
                    as: 'horarios',  // Alias para la relación
                    order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']],  // Ordenar horarios
                },
            ],
        });

        if (!sala) {
            return res.status(404).json({ message: "Sala no encontrada" });  // Sala no encontrada
        }

        res.status(200).json(sala);  // Devolver la sala y sus horarios asociados
    } catch (error) {
        console.error("Error al obtener datos de la sala:", error.message);
        res.status(500).json({ message: "Error al obtener datos de la sala" });  // Manejo de errores
    }
};

export const addVirtualRoom = async (req,res) =>{
    console.log("Se llamo al endpoint GET /aulavirtual con " + req)
    const roomId = uuidV4(); // Genera un ID único
    res.redirect(`/aulavirtual/${roomId}`);
}

export const getVirtualRoom = async (req,res) =>{
    console.log("Se llamo al endpoint GET /aulavirtual/:roomId con " + req)
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
}

