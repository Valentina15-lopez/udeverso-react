import {UsuariosMateriales} from "../models/index.js";


/*
export const addMaterialToUser = async (req, res)=>{
    console.log("Se llamo al endpoint POST /api/users/material con " + JSON.stringify(req.body));
    try {
        const { usuario, nombre, ext } = req.body;
        const fileBuffer = req.file.buffer;

        // Guardar el archivo en la base de datos PostgreSQL
        const result = await pool.query(
            "INSERT INTO usuario_material (usuario, nombre, ext, material) VALUES ($1, $2, $3, $4)",
            [usuario, nombre, ext, fileBuffer]
        );

        console.log("Material agregado exitosamente");
        res.status(200).send("Material agregado exitosamente");
    } catch (error) {
        console.error("Error al agregar material:", error.message);
        res.status(500).send("Error al agregar material");
    }
}
*/

export const addMaterialToUser = async (req, res) => {
    console.log("Se llamó al endpoint POST /api/users/material con " + JSON.stringify(req.body));

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

        console.log("Material agregado exitosamente");
        res.status(200).json(nuevoMaterial);  // Respuesta exitosa con el material agregado
    } catch (error) {
        console.error("Error al agregar material:", error.message);
        res.status(500).json({ message: "Error al agregar material" });  // Manejo de errores
    }
};

/*
export const getAllMaterialsOfUser= async (req,res)=> {
    console.log("Se llamo al endpoint GET /api/users/:usuario/material con " + JSON.stringify(req.body));
    try {
        const { usuario } = req.params;
        const query = "SELECT * FROM usuario_material WHERE usuario = $1";
        const values = [usuario];
        const { rows } =  await pool.query(query, values);
        const materiales = await rows;
        res.status(200).json(materiales);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
}
*/

export const getAllMaterialsOfUser = async (req, res) => {
    console.log("Se llamó al endpoint GET /api/users/:usuario/material con " + JSON.stringify(req.body));

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

/*
export const deleteMaterialOfUser = async (req, res) => {
    console.log("Se llamo al endpoint DELETE /api/users/:usuario/material/:nombre con " + JSON.stringify(req.body));
    try {
        const { usuario , nombre} = req.params; // ID del usuario a eliminar

        console.log("El material " + nombre + " se va a borrar del usuario " + usuario);

        // Ejecutar la operación DELETE
        const result = await pool.query("DELETE FROM usuario_material WHERE usuario = $1 and nombre = $2", [usuario, nombre]);

        // Verificar cuántas filas fueron afectadas
        if (result.rowCount > 0) {
            console.log("Material borrado con exito");
            res.status(200).send("Material borrado con exito");
        } else {
            console.log("Material no encontrado");
            res.status(404).send("Material no encontrado");
        }
    } catch (error) {
        console.error("Error al eliminar material:", error);
        res.status(500).send("Error del servidor");
    }
}*/

export const deleteMaterialOfUser = async (req, res) => {
    console.log("Se llamó al endpoint DELETE /api/users/:usuario/material/:nombre con " + JSON.stringify(req.body));

    try {
        const { usuario, nombre } = req.params;  // Obtener el usuario y el nombre del material

        console.log("El material " + nombre + " se va a borrar del usuario " + usuario);

        // Eliminar el material que corresponde al usuario y al nombre dados
        const deletedCount = await UsuariosMateriales.destroy({
            where: {
                usuario,  // Condición para usuario
                nombre,  // Condición para nombre
            },
        });

        // Verificar cuántas filas fueron afectadas
        if (deletedCount > 0) {
            console.log("Material borrado con éxito");
            res.status(200).send("Material borrado con éxito");  // Operación exitosa
        } else {
            console.log("Material no encontrado");
            res.status(404).send("Material no encontrado");  // Material no encontrado
        }
    } catch (error) {
        console.error("Error al eliminar material:", error.message);
        res.status(500).json({ message: "Error del servidor" });  // Manejo de errores
    }
};