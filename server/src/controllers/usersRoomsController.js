import pool from "../config/database.js";

export const addUserToRoom = async (req,res)=>{
    console.log("Se llamó al endpoint POST /api/users/:userId/salas con " + JSON.stringify(req.body));

    const client = await pool.connect(); // Transacción para garantizar consistencia
    try {
        await client.query("BEGIN");

        const userId = req.params.userId
        const { salaIds } = req.body;

        if (!Array.isArray(salaIds)) {
            throw new Error("salaIds debe ser un array");
        }

        for (const salaId of salaIds) {
            await client.query(
                "INSERT INTO user_salas (user_id, sala_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [userId, salaId]
            );
        }

        await client.query("COMMIT");
        console.log("Usuario asignado a las salas exitosamente.");
        res.status(201).send("Usuario asignado a las salas exitosamente.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error al asignar usuario a salas:", error.message);
        res.status(500).send("Error al asignar usuario a salas.");
    } finally {
        client.release();
    }
}

export const deleteUserFromRoom = async (req, res) => {
    try {
        const userId = req.params.userId
        const salaId = parseInt(req.params.salaId, 10);

        await pool.query(
            "DELETE FROM user_salas WHERE user_id = $1 AND sala_id = $2",
            [userId, salaId]
        );

        console.log("Usuario eliminado de la sala.");
        res.status(200).send("Usuario eliminado de la sala.");
    } catch (error) {
        console.error("Error al eliminar usuario de la sala:", error.message);
        res.status(500).send("Error al eliminar usuario de la sala.");
    }
}

export const getRoomsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await pool.query(
            "SELECT s.* FROM user_salas us JOIN salas s ON us.sala_id = s.id WHERE us.user_id = $1",
            [userId]
        );

        res.status(200).json(result.rows); // Devolver todas las salas del usuario
    } catch (error) {
        console.error("Error al obtener salas del usuario:", error.message);
        res.status(500).send("Error al obtener salas del usuario.");
    }
}

export const getUsersOfRoom = async (req,res) =>{
    try {
        const salaId = parseInt(req.params.salaId, 10);

        const result = await pool.query(
            "SELECT u.* FROM user_salas us JOIN users u ON us.user_id = u.id WHERE us.sala_id = $1",
            [salaId]
        );

        res.status(200).json(result.rows); // Devolver todos los usuarios de la sala
    } catch (error) {
        console.error("Error al obtener usuarios de la sala:", error.message);
        res.status(500).send("Error al obtener usuarios de la sala.");
    }
}
