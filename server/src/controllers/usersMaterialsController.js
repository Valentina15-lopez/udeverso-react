import pool from "../config/database.js";

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
}