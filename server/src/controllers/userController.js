// src/controllers/userController.js
import Usuarios from '../models/Usuarios.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = "miClaveSecreta";

export const checkAuth = (req, res) => {
    //console.log("Se llamo al endpoint GET /api/checkAuth con " + JSON.stringify(req.body));
    const token = req.cookies.sessionToken; // Obtener el token de la cookie
    if (!token) { // Si no hay token
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, decoded) => { // Verificar el token
        if (err) {
            return res.sendStatus(403); // Si hay un error en el token
        }
        res.sendStatus(200); // Si el token es válido
    });
};

export const login = async (req, res) => {
    //console.log('Se llamó al endpoint POST /login con ' + JSON.stringify(req.body));
    const { nombreUsuario, contrasena } = req.body; // Obtener los datos del cuerpo de la petición

    try {
        // Usar Sequelize para encontrar al usuario por el nombre de usuario
        const usuario = await Usuarios.findOne({ where: { usuario: nombreUsuario } });

        if (!usuario) { // Si no se encontró el usuario
            //console.log("Usuario no encontrado");
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña ingresada coincide con la almacenada
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasenia);

        if (!contrasenaValida) { // Si la contraseña no coincide
            //console.log("Contraseña incorrecta");
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT para el usuario autenticado
        const token = jwt.sign({ userId: usuario.usuario }, secretKey, {
            expiresIn: '24h',  // El token expirará en 24 horas
        });

        // Establecer el token como cookie en la respuesta
        res.cookie('sessionToken', token, { httpOnly: true });

        // Enviar la respuesta con información del usuario (o solo el token, según tu preferencia)
        res.status(200).json({ usuario, token });
        //console.log("Respuesta enviada con informacion del usuario y token");
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createUser = async (req, res) => {
    //console.log("Se llamó al endpoint POST /api/users con " + JSON.stringify(req.body));
    const { usuario, contrasenia, nombre_para_mostrar, avatar_id, correo, rol } = req.body; // Obtener los datos del cuerpo de la petición

    try {
        const saltRounds = 10; // Número de rondas para el algoritmo de encriptación
        const hashContrasenia = await bcrypt.hash(contrasenia, saltRounds);  // Encriptar la contraseña

        // Crear el nuevo usuario usando el modelo Usuario
        const nuevoUsuario = await Usuarios.create({
            usuario,
            contrasenia: hashContrasenia,
            nombre_para_mostrar,
            avatar_id,
            correo,
            rol,
        });

        res.status(201).json(nuevoUsuario);  // Respuesta con el usuario creado
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getAllUsers = async (req, res) => {
    //console.log("Se llamó al endpoint GET /api/users con " + JSON.stringify(req.body));

    try {
        // Obtener todos los usuarios usando Sequelize
        const users = await Usuarios.findAll();  // Devuelve todos los registros

        res.status(200).json(users);  // Respuesta con la lista de usuarios
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getUser = async (req, res) => {
    //console.log("Se llamó al endpoint GET /api/users/:id con " + JSON.stringify(req.body));

    try {
        const id = req.params.id;  // Obtener el identificador del usuario desde la URL

        // Buscar un usuario por el campo `usuario`
        const user = await Usuarios.findOne({
            where: { usuario: id },  // Condición para buscar el usuario
        });

        // Verificamos si se encontró el usuario
        if (user) {
            res.status(200).json(user);  // Si el usuario existe, devolvemos sus datos
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });  // Si no se encuentra, error 404
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });  // Responder con un error 500
    }
};

export const updateUser = async (req, res) => {
    //console.log("Se llamó al endpoint PUT /api/users/:usuario con " + JSON.stringify(req.body));
    const { usuario } = req.params;  // El usuario a actualizar

    try {
        const {
            nombre_para_mostrar,
            avatar_id,
            correo,
            rol,
        } = req.body; // Campos a actualizar

        // Crear un objeto con los campos a actualizar
        const updateData = {};

        if (nombre_para_mostrar !== undefined) { // Si se proporciona el campo `nombre_para_mostrar`
            updateData.nombre_para_mostrar = nombre_para_mostrar;
        }

        if (avatar_id !== undefined) { // Si se proporciona el campo `avatar_id`
            updateData.avatar_id = avatar_id;
        }

        if (correo !== undefined) { // Si se proporciona el campo `correo`
            updateData.correo = correo;
        }

        if (rol !== undefined) { // Si se proporciona el campo `es_estudiante`
            updateData.rol = rol;
        }

        if (Object.keys(updateData).length === 0) { // Verificar si hay campos para actualizar
            return res.status(400).json({ message: "Nada para actualizar" });
        }

        // Actualizar el usuario usando Sequelize
        const [updatedCount, [updatedUser]] = await Usuarios.update(updateData, {
            where: { usuario },  // Condición para encontrar el usuario
            returning: true,  // Devuelve el registro actualizado
        });

        if (updatedCount === 0) { // Verificar si se actualizó algún registro
            return res.status(404).json({ message: "Usuario no encontrado" });  // Si no se encuentra el usuario
        }

        res.json(updatedUser);  // Devuelve el usuario actualizado
    } catch (error) {
        console.error("Error actualizando usuario:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteUser = async (req, res) => {
    //console.log("Se llamó al endpoint DELETE /api/users/:usuario con " + JSON.stringify(req.body));

    try {
        const { usuario } = req.params;  // Obtener el ID del usuario a eliminar

        // Ejecutar la operación DELETE usando Sequelize
        const deletedCount = await Usuarios.destroy({
            where: { usuario },  // Condición para identificar el usuario a eliminar
        });

        // Verificar cuántas filas fueron afectadas
        if (deletedCount > 0) {
            res.status(200).send("Usuario borrado con éxito");  // Responder si la operación fue exitosa
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });  // Responder si el usuario no se encontró
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });  // Manejar errores del servidor
    }
};