import {v4 as uuidV4} from "uuid";
import pool from "../config/database.js";

export const addRoom = async (req,res) => {
    console.log("Se llamó al endpoint POST /api/salas con " + JSON.stringify(req.body));

    const client = await pool.connect(); // Obtener un cliente para transacciones
    try {
        await client.query("BEGIN"); // Iniciar la transacción

        const { descripcion, horarios } = req.body; // Información de la sala y sus horarios

        // Insertar la nueva sala
        const salaResult = await client.query(
            "INSERT INTO salas (descripcion) VALUES ($1) RETURNING id",
            [descripcion]
        );

        const salaId = salaResult.rows[0].id; // Obtener el ID de la sala recién creada

        // Insertar los horarios para esta sala
        for (const horario of horarios) {
            const { dia_semana, hora_inicio, hora_fin } = horario;

            await client.query(
                "INSERT INTO horarios_salas (sala_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)",
                [salaId, dia_semana, hora_inicio, hora_fin]
            );
        }

        await client.query("COMMIT"); // Confirmar la transacción

        console.log("Sala y horarios agregados exitosamente");
        res.status(201).send("Sala y horarios agregados exitosamente");
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir la transacción en caso de error
        console.error("Error al agregar sala y horarios:", error.message);
        res.status(500).send("Error al agregar sala y horarios");
    } finally {
        client.release(); // Liberar el cliente
    }
}

export const updateSchedules = async (req,res) => {
    console.log("Se llamó al endpoint PUT /api/:salaId/horarios con " + JSON.stringify(req.body));

    const client = await pool.connect(); // Obtener un cliente para transacciones

    try {
        await client.query("BEGIN"); // Iniciar la transacción

        const salaId = parseInt(req.params.salaId, 10);
        const { horarios } = req.body;

        // Validación básica para horarios
        if (!Array.isArray(horarios)) {
            throw new Error("El formato de horarios debe ser un array.");
        }

        // Eliminar los horarios existentes para la sala
        await client.query("DELETE FROM horarios_salas WHERE sala_id = $1", [salaId]);

        // Insertar los nuevos horarios
        for (const horario of horarios) {
            const { dia_semana, hora_inicio, hora_fin } = horario;

            if (
                typeof dia_semana !== "number" ||
                typeof hora_inicio !== "string" ||
                typeof hora_fin !== "string"
            ) {
                throw new Error("Horarios mal formateados.");
            }

            await client.query(
                "INSERT INTO horarios_salas (sala_id, dia_semana, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4)",
                [salaId, dia_semana, hora_inicio, hora_fin]
            );
        }

        await client.query("COMMIT"); // Confirmar la transacción

        res.status(200).send("Horarios modificados exitosamente.");
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir la transacción en caso de error
        console.error("Error al modificar horarios:", error.message);
        res.status(500).send("Error al modificar horarios.");
    } finally {
        client.release(); // Liberar el cliente
    }
}

export const deleteRoom = async (req,res) =>{
    const client = await pool.connect(); // Obtener un cliente para transacciones

    try {
        await client.query("BEGIN"); // Iniciar la transacción

        const salaId = parseInt(req.params.salaId, 10);

        // Primero, verifica si la sala existe
        const checkSala = await client.query("SELECT * FROM salas WHERE id = $1", [salaId]);

        if (checkSala.rowCount === 0) {
            res.status(404).send("Sala no encontrada");
            await client.query("ROLLBACK"); // Revertir la transacción en caso de error
            return;
        }

        //Si no hay clave foranea hacer
        await client.query("DELETE FROM horarios_salas WHERE sala_id = $1", [salaId]);

        // Borrar la sala (esto también borrará sus horarios gracias a la clave foránea)
        await client.query("DELETE FROM salas WHERE id = $1", [salaId]);

        await client.query("COMMIT"); // Confirmar la transacción

        res.status(200).send("Sala y horarios eliminados exitosamente");
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir la transacción en caso de error
        console.error("Error al borrar la sala:", error.message);
        res.status(500).send("Error al borrar la sala");
    } finally {
        client.release(); // Liberar el cliente
    }
}

export const getAllRooms = async (req,res) =>{
    try {
        // Consulta para obtener todas las salas y sus horarios
        const result = await pool.query("SELECT s.id AS sala_id, s.descripcion, " +
            "h.dia_semana, h.hora_inicio, h.hora_fin " +
            "FROM salas s, horarios_salas h " +
            "where  s.id = h.sala_id " +
            "ORDER BY s.id, h.dia_semana, h.hora_inicio");

        // Organizar los datos por sala
        const salas = [];
        const salaMap = {}; // Mapa para evitar duplicados de salas

        for (const row of result.rows) {
            const { sala_id, descripcion, dia_semana, hora_inicio, hora_fin } = row;

            if (!salaMap[sala_id]) {
                // Si la sala no está en el mapa, agregarla al array y al mapa
                const sala = {
                    id: sala_id,
                    descripcion: descripcion,
                    horarios: []
                };
                salas.push(sala);
                salaMap[sala_id] = sala;
            }

            // Si hay horarios, agregar al array de horarios de la sala
            if (dia_semana !== null) {
                salaMap[sala_id].horarios.push({
                    dia_semana,
                    hora_inicio,
                    hora_fin
                });
            }
        }

        res.status(200).json(salas); // Devolver las salas y sus horarios
    } catch (error) {
        console.error("Error al obtener salas:", error.message);
        res.status(500).send("Error al obtener salas");
    }
}

export const getRoom = async (req,res) =>{
    try {
        const salaId = parseInt(req.params.salaId, 10);

        // Consulta para obtener la sala y sus horarios
        const result = await pool.query("SELECT s.id AS sala_id, s.descripcion, "+
            "h.dia_semana, h.hora_inicio, h.hora_fin " +
            "FROM salas s, horarios_salas h " +
            "WHERE s.id = h.sala_id and s.id = $1 " +
            "ORDER BY h.dia_semana, h.hora_inicio", [salaId]);

        if (result.rowCount === 0) {
            res.status(404).send("Sala no encontrada");
            return;
        }

        // Crear la estructura para devolver la información de la sala
        const sala = {
            id: result.rows[0].sala_id,
            descripcion: result.rows[0].descripcion,
            horarios: []
        };

        // Añadir los horarios a la sala
        for (const row of result.rows) {
            const { dia_semana, hora_inicio, hora_fin } = row;

            if (dia_semana !== null) {
                sala.horarios.push({
                    dia_semana,
                    hora_inicio,
                    hora_fin
                });
            }
        }

        res.status(200).json(sala); // Devolver la información de la sala
    } catch (error) {
        console.error("Error al obtener datos de la sala:", error.message);
        res.status(500).send("Error al obtener datos de la sala");
    }
}

export const addVirtualRoom = async (req,res) =>{
    console.log("Se llamo al endpoint GET /aulavirtual con " + req)
    const roomId = uuidV4(); // Genera un ID único
    res.redirect(`/aulavirtual/${roomId}`);
}

export const getVirtualRoom = async (req,res) =>{
    console.log("Se llamo al endpoint GET /aulavirtual/:roomId con " + req)
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
}

