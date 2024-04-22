import React, { useState, useEffect } from "react";
import axios from "axios";

const ListMaterial = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState("");
    const [materiales, setMateriales] = useState([]);

    // Cargar lista de usuarios al inicio
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/users");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        };

        loadUsers(); // Se ejecuta solo una vez
    }, []);

    // Cargar lista de materiales del usuario seleccionado
    useEffect(() => {
        const loadMaterials = async () => {
            if (selectedUsuario) { // Solo cargar si hay un usuario seleccionado
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/users/${selectedUsuario}/material`
                    );
                    setMateriales(response.data); // Guardar la lista de materiales
                } catch (error) {
                    console.error("Error al cargar materiales del usuario:", error);
                }
            } else {
                setMateriales([]); // Si no hay usuario seleccionado, limpiar materiales
            }
        };

        loadMaterials(); // Se ejecuta cada vez que cambia el usuario seleccionado
    }, [selectedUsuario]);

    const handleChange = (e) => {
        setSelectedUsuario(e.target.value); // Cambia el usuario seleccionado
    };

    const downloadMaterial = (material) => {
        const { nombre, ext, material: content } = material;

        // Crear un Blob a partir del buffer
        const blob = new Blob([new Uint8Array(content.data)], { type: 'application/octet-stream' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${nombre}.${ext}`; // Nombre del archivo con su extensión
        link.click(); // Simula el clic para descargar
        window.URL.revokeObjectURL(downloadUrl); // Liberar la URL para evitar fugas de memoria
    };

    const deleteMaterial = async  (material) => {
        const { nombre, ext, material: content } = material;

        try {
            const response = await axios.delete(
                `http://localhost:3001/api/users/${selectedUsuario}/material/`+nombre
            );
            console.log("Material borrado exitosamente");
        } catch (error) {
            console.error("Error al borrar materiales del usuario:", error);
        }
    };

    return (
        <div>
            <h1>Ver materiales de usuario</h1>
            <form>
                <label>
                    Usuario:
                    <select name="usuario"
                            value={selectedUsuario}
                            onChange={handleChange}>
                        <option value="">Seleccionar Usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.usuario} value={usuario.usuario}>
                                {usuario.usuario}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                {/* Lista de materiales del usuario */}
                {materiales.length > 0 && (
                    <ul>
                        {materiales.map((material, index) => (
                            <li key={index}>
                                {material.nombre}.{material.ext}
                                {/* Botón para descargar el material */}
                                <button type="button" onClick={() => downloadMaterial(material)}>
                                    Descargar
                                </button>
                                <button type="button" onClick={() => deleteMaterial(material)}>
                                    Borrar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
};

export default ListMaterial;

