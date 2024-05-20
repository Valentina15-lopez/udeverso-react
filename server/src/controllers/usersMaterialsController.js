import {UsuariosMateriales} from "../models/index.js";

export const addMaterialToUser = async (req, res) => {

    try {
        const { usuario, nombre, ext } = req.body;  // Datos del material
        const fileBuffer = req.file.buffer;  // Buffer del archivo cargado

        // Crear un nuevo registro en la base de datos con Sequelize
        const nuevoMaterial = await UsuariosMateriales.create({
            usuario,  // Usuario al que pertenece el material
            nombre,  // Nombre del material
            ext,  // Extensión del archivo
            material: fileBuffer,  // El contenido binario del archivo
        });

        res.status(200).json(nuevoMaterial);  // Respuesta exitosa con el material agregado
    } catch (error) {
        console.error("Error al agregar material:", error.message);
        res.status(500).json({ message: "Error al agregar material" });  // Manejo de errores
    }
};

export const getAllMaterialsOfUser = async (req, res) => {

    try {
        const { usuario } = req.params;  // Obtener el usuario del parámetro de la ruta

        // Obtener todos los materiales asociados a un usuario específico
        const materiales = await UsuariosMateriales.findAll({
            where: { usuario },  // Filtrar por usuario
        });

        res.status(200).json(materiales);  // Devolver los materiales como respuesta
    } catch (error) {
        console.error("Error al obtener materiales del usuario:", error.message);
        res.status(500).json({ message: "Error al obtener materiales del usuario" });  // Manejo de errores
    }
};

export const deleteMaterialOfUser = async (req, res) => {

    try {
        const { usuario, nombre } = req.params;  // Obtener el usuario y el nombre del material

        // Eliminar el material que corresponde al usuario y al nombre dados
        const deletedCount = await UsuariosMateriales.destroy({
            where: {
                usuario,  // Condición para usuario
                nombre,  // Condición para nombre
            },
        });

        // Verificar cuántas filas fueron afectadas
        if (deletedCount > 0) {
            res.status(200).json({ message: "Material borrado con éxito" });  // Operación exitosa
        } else {
            res.status(404).json({ message: "Material no encontrado" });  // Material no encontrado
        }
    } catch (error) {
        console.error("Error al eliminar material:", error.message);
        res.status(500).json({ message: "Error del servidor" });  // Manejo de errores
    }
};