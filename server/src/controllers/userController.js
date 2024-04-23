// src/controllers/userController.js
import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = "miClaveSecreta";

export const checkAuth = (req, res) => {
    console.log("Se llamo al endpoint GET /api/checkAuth con " + JSON.stringify(req.body));
    const token = req.cookies.sessionToken;
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.sendStatus(200);
    });
};

export const login = async (req, res) => {
    console.log("Se llamo al endpoint POST /login con " + JSON.stringify(req.body));
    const { nombreUsuario, contrasena } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE usuario = $1", [nombreUsuario]);
        const usuario = result.rows[0];

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasenia);
        if (!contrasenaValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ userId: usuario.id }, secretKey, {
            expiresIn: "24h",
        });

        res.cookie("sessionToken", token, { httpOnly: true });
        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error al autenticar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const createUser = async (req, res) => {
    console.log("Se llamo al endpoint POST /api/users con " + JSON.stringify(req.body));
    const { usuario, contrasenia, nombre_para_mostrar, avatar_id, correo, es_estudiante } = req.body;

    try {
        const saltRounds = 10;
        const hashContrasenia = await bcrypt.hash(contrasenia, saltRounds);

        const nuevoUsuario = await pool.query(
            "INSERT INTO users (usuario, contrasenia, nombre_para_mostrar, avatar_id, correo, es_estudiante) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [usuario, hashContrasenia, nombre_para_mostrar, avatar_id, correo, es_estudiante]
        );

        res.json(nuevoUsuario.rows[0]);
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const getAllUsers= async (req, res) => {
    console.log("Se llamo al endpoint GET /api/users con " + JSON.stringify(req.body));
    try {
        const users = await pool.query("SELECT * FROM users");
        res.status(200).json(users.rows);
        //console.dir("Los usuarios devueltos son " + users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
}

export const getUser = async (req,res)=>{
    console.log("Se llamo al endpoint GET /api/users/:id con " + JSON.stringify(req.body));
    try {
        const id = req.params.id;
        const users = await pool.query("SELECT * FROM users WHERE usuario = $1", [id]);

        //console.dir("Los usuarios devueltos son " + users.rows.json);

        // Verificamos si se encontró el usuario
        if (users.rows.length > 0) {
            res.status(200).json(users.rows[0]); // Si el usuario existe, devolvemos sus datos
        } else {
            res.status(404).send("Usuario no encontrado"); // Si no existe, devolvemos un error 404
        }
    } catch (error) {
        console.error("Error al obtener usuarios:", error.message); // Imprimir el mensaje de error en la consola
        res.status(500).json({ error: "Error al obtener el usuario." }); // Devolver un mensaje de error al cliente
    }
}

export const updateUser = async(req,res)=>{
    console.log("Se llamo al endpoint PUT /api/users/:usuario con " + JSON.stringify(req.body));
    try {
        const { usuario } = req.params; // El usuario a actualizar
        const {
            nombre_para_mostrar,
            avatar_id,
            correo,
            es_estudiante,
        } = req.body;

        const updateFields = [];
        const updateValues = [usuario]; // Comienza con el usuario para la cláusula WHERE
        let updateIndex = 2; // El primer índice libre para parámetros dinámicos

        // Agregar cada campo solo si está definido en el cuerpo de la solicitud
        if (nombre_para_mostrar !== undefined) {
            updateFields.push(`nombre_para_mostrar = $${updateIndex}`);
            updateValues.push(nombre_para_mostrar);
            updateIndex++;
        }

        if (avatar_id !== undefined) {
            updateFields.push(`avatar_id = $${updateIndex}`);
            updateValues.push(avatar_id);
            updateIndex++;
        }

        if (correo !== undefined) {
            updateFields.push(`correo = $${updateIndex}`);
            updateValues.push(correo);
            updateIndex++;
        }

        if (es_estudiante !== undefined) {
            // Asegúrate de manejar correctamente el tipo de datos para `es_estudiante`
            const esEstudianteBoolean = es_estudiante === "1" || es_estudiante === "true";
            updateFields.push(`es_estudiante = $${updateIndex}`);
            updateValues.push(esEstudianteBoolean);
            updateIndex++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: "Nada para actualizar" });
        }

        const updateUserQuery = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE usuario = $1
        RETURNING *;
    `;

        const updatedUser = await pool.query(updateUserQuery, updateValues);

        if (updatedUser.rowCount === 0) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.json(updatedUser.rows[0]); // Devuelve el usuario actualizado
    } catch (err) {
        console.error("Error actualizando usuario:", err.message);
        res.status(500).send("Error del servidor");
    }
}

export const deleteUser = async(req,res)=> {
    console.log("Se llamo al endpoint DELETE /api/users/:usuario con " + JSON.stringify(req.body));
    try {
        const { usuario } = req.params; // ID del usuario a eliminar

        console.log("El usuario a borrar es " + usuario);

        // Ejecutar la operación DELETE
        const result = await pool.query("DELETE FROM users WHERE usuario = $1", [usuario]);

        // Verificar cuántas filas fueron afectadas
        if (result.rowCount > 0) {
            res.status(200).send("Usuario borrado con éxito");
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).send("Error del servidor");
    }
}